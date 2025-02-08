import { describe, beforeAll, afterAll, beforeEach, afterEach, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type Account from '../../types/account.ts'
import type User from '../../types/user.ts'
import { PROVIDERS } from '../../types/provider.ts'
import DB from '../../DB.ts'
import AccountRepository from './repository.ts'
import setupUser from '../../utils/testing/setup-user.ts'

describe('AccountRepository', () => {
  let repository: AccountRepository
  let acct: Account
  let user: User
  let uid: string = crypto.randomUUID()

  beforeAll(() => {
    repository = new AccountRepository()
  })

  beforeEach(async () => {
    const data = await setupUser({ createToken: false })
    user = data.user
    uid = user?.id ?? uid
    acct = data.account!
  })

  afterAll(DB.close)
  afterEach(DB.clear)

  describe('save', () => {
    it('can create a new account', async () => {
      const saved = await repository.save(acct)
      const { total, rows } = await repository.list()

      expect(saved?.uid).toBe(user.id)
      expect(total).toBe(1)
      expect(rows).toHaveLength(1)
      expect(rows[0].id).toBe(saved?.id)
    })

    it('won\'t create the same account twice', async () => {
      const saved = await repository.save(acct)
      await repository.save(acct)
      const { total, rows } = await repository.list()

      expect(saved?.uid).toBe(user.id)
      expect(total).toBe(1)
      expect(rows).toHaveLength(1)
      expect(rows[0].id).toBe(saved?.id)
    })
  })

  describe('get', () => {
    it('returns null if given an invalid UUID', async () => {
      const actual = await repository.get('lol-nope')
      expect(actual).toBeNull()
    })

    it('returns null if nothing matches', async () => {
      const actual = await repository.get('00000000-0000-0000-0000-000000000000')
      expect(actual).toBeNull()
    })

    it('returns a single record based on ID', async () => {
      const saved = await repository.save(acct)
      const actual = await repository.get(saved?.id!)
      expect(actual).not.toBeNull()
      expect(saved?.id).toBe(actual!.id)
      expect(actual?.uid).toBe(user.id)
      expect(actual?.provider).toBe(acct.provider)
      expect(actual?.pid).toBe(acct.pid)
    })
  })

  describe('getByUIDAndProvider', () => {
    it('returns null if given an invalid UUID', async () => {
      const actual = await repository.getByUIDAndProvider('lol-nope', PROVIDERS.GOOGLE)
      expect(actual).toBeNull()
    })

    it('returns null if given a user ID that does not exist', async () => {
      const actual = await repository.getByUIDAndProvider('00000000-0000-0000-0000-000000000000', PROVIDERS.GOOGLE)
      expect(actual).toBeNull()
    })

    it('returns null if no such account exists', async () => {
      const actual = await repository.getByUIDAndProvider(crypto.randomUUID(), PROVIDERS.DISCORD)
      expect(actual).toBeNull()
    })

    it('returns a single record based on ID', async () => {
      const actual = await repository.getByUIDAndProvider(uid, acct.provider)
      expect(actual).not.toBeNull()
      expect(actual?.uid).toBe(uid)
      expect(actual?.pid).toBe(acct.pid)
    })
  })

  describe('getByProviderAndProviderID', () => {
    it('returns null if given an invalid provider/ID combination', async () => {
      const actual = await repository.getByProviderAndProviderID(PROVIDERS.GOOGLE, crypto.randomUUID())
      expect(actual).toBeNull()
    })

    it('returns a single record based on provider and ID', async () => {
      const actual = await repository.getByProviderAndProviderID(acct.provider, acct.pid)
      expect(actual).not.toBeNull()
      expect(actual?.uid).toBe(uid)
      expect(actual?.pid).toBe(acct.pid)
    })
  })

  describe('list', () => {
    it('returns all existing records', async () => {
      await repository.save(acct)
      const actual = await repository.list()
      expect(actual.total).toBe(1)
      expect(actual.rows).toHaveLength(1)
    })

    it('paginates results', async () => {
      const google = await repository.save({ uid, provider: PROVIDERS.GOOGLE, pid: '1' }) as Account
      const github = await repository.save({ uid, provider: PROVIDERS.GITHUB, pid: '1' }) as Account
      const discord = await repository.save({ uid, provider: PROVIDERS.DISCORD, pid: '1' }) as Account

      const p1 = await repository.list(1, 0)
      const p2 = await repository.list(1, 1)
      const p3 = await repository.list(1, 2)
      const scenarios: [{ total: number, rows: Account[] }, Account][] = [[p1, google], [p2, github], [p3, discord]]

      for (const [result, account] of scenarios) {
        expect(result.total).toBe(3)
        expect(result.rows).toHaveLength(1)
        expect(result.rows[0].provider).toBe(account.provider)
        expect(result.rows[0].uid).toBe(user.id)
        expect(result.rows[0].pid).toBe(account.pid)
      }
    })
  })

  describe('listProviders', () => {
    it('returns an empty array if given an invalid UUID', async () => {
      const actual = await repository.listProviders('lol-nope')
      expect(actual).toEqual([])
    })

    it('returns an empty array if given a user ID that does not exist', async () => {
      const actual = await repository.listProviders('00000000-0000-0000-0000-000000000000')
      expect(actual).toEqual([])
    })

    it('returns an array of providers', async () => {
      await repository.save(acct)
      const actual = await repository.listProviders(uid)
      expect(actual).not.toBeNull()
      expect(actual).toHaveLength(1)
      expect(actual).toContain(acct.provider)
    })
  })
})
