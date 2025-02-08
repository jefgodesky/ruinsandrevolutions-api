import { describe, beforeAll, afterAll, beforeEach, afterEach, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { hash } from '@stdext/crypto/hash'
import type AuthTokenRecord from '../../../types/auth-token-record.ts'
import type User from '../../../types/user.ts'
import DB from '../../../DB.ts'
import userToAuthTokenRecord from '../../../utils/transformers/user-to/auth-token-record.ts'
import RoleRepository from '../../users/roles/repository.ts'
import UserRepository from '../../users/repository.ts'
import setupUser from '../../../utils/testing/setup-user.ts'
import AuthTokenRepository from './repository.ts'

describe('AuthTokenRepository', () => {
  let repository: AuthTokenRepository
  let token: AuthTokenRecord
  let roles: RoleRepository
  let users: UserRepository
  let user: User
  let uid: string = crypto.randomUUID()

  beforeAll(() => {
    roles = new RoleRepository()
    users = new UserRepository()
    repository = new AuthTokenRepository()
  })

  beforeEach(async () => {
    const data = await setupUser({ createToken: false })
    user = data.user
    uid = user?.id ?? uid
    token = userToAuthTokenRecord(user)
  })

  afterAll(DB.close)
  afterEach(DB.clear)

  describe('save', () => {
    it('can create a new token', async () => {
      const saved = await repository.save(token)
      const { total, rows } = await repository.list()
      expect(saved?.uid).toBe(user.id)
      expect(total).toBe(1)
      expect(rows).toHaveLength(1)
      expect(rows[0].id).toBe(saved?.id)
    })

    it('won\'t create a token for an inactive user', async () => {
      await roles.revoke(uid, 'active')
      await repository.save(token)
      const { total, rows } = await repository.list()
      expect(total).toBe(0)
      expect(rows).toHaveLength(0)
    })
  })

  describe('list', () => {
    it('won\'t include unlisted users\' tokens', async () => {
      await repository.save(token)
      await roles.revoke(uid, 'listed')
      const actual = await repository.list()
      expect(actual.total).toBe(0)
      expect(actual.rows).toHaveLength(0)
    })
  })

  describe('get', () => {
    it('returns null if given an invalid UUID', async () => {
      const actual = await repository.get('lol-nope')
      expect(actual).toBeNull()
    })

    it('returns null if nothing matches', async () => {
      const actual = await repository.get(crypto.randomUUID())
      expect(actual).toBeNull()
    })

    it('returns a single record based on ID', async () => {
      const saved = await repository.save(token)
      const actual = await repository.get(saved?.id!)
      expect(actual).not.toBeNull()
      expect(saved?.id).toBe(actual!.id)
      expect(actual?.uid).toBe(user.id)
      expect(actual?.refresh).toBe(token.refresh)
      expect(actual?.token_expiration).toEqual(token.token_expiration)
      expect(actual?.refresh_expiration).toEqual(token.refresh_expiration)
    })

    it('won\'t get an inactive user\'s token', async () => {
      const saved = await repository.save(token)
      await roles.revoke(uid, 'active')
      const actual = await repository.get(saved?.id!)
      expect(actual).toBeNull()
    })
  })

  describe('exchange', () => {
    const expectNoExchange = (actual: AuthTokenRecord | null, check: AuthTokenRecord | null, baseline: AuthTokenRecord): void => {
      expect(actual).toBeNull()
      expect(check?.id).toBe(baseline.id)
      expect(check?.refresh).toBe(baseline.refresh)
      expect(check?.token_expiration).toEqual(baseline.token_expiration)
      expect(check?.refresh_expiration).toEqual(baseline.refresh_expiration)
    }

    it('does nothing if not given a valid hash of the refresh token', async () => {
      const orig = await repository.save(token)
      const bad = Object.assign({}, orig, { refresh: 'nope' })
      const actual = await repository.exchange(bad)
      const check = await repository.get(bad.id ?? '')
      expectNoExchange(actual, check, orig!)
    })

    it('creates a new token', async () => {
      const orig = await repository.save(token)
      const refresh = hash('argon2', orig!.refresh)
      const good = Object.assign({}, orig, { refresh })
      const actual = await repository.exchange(good)
      const check1 = await repository.get(orig?.id ?? '')
      const check2  = await repository.get(actual?.id ?? '')

      expect(actual).not.toBeNull()
      expect(actual?.id).not.toBe(orig?.id)
      expect(actual?.uid).toBe(orig?.uid)
      expect(actual?.refresh).not.toBe(token.refresh)
      expect(actual?.token_expiration.getTime()).toBeGreaterThanOrEqual(orig!.token_expiration.getTime())
      expect(actual?.refresh_expiration).toEqual(token.refresh_expiration)
      expect(check1).toBeNull()
      expect(check2).not.toBeNull()
      expect(check2).toEqual(actual)
    })

    it('does nothing if refresh has expired', async () => {
      const expired = Object.assign({}, token, {
        refresh_expiration: new Date(Date.now() - 60 * 1000)
      })

      const orig = await repository.save(expired)
      const actual = await repository.exchange(orig!)
      const check = await repository.get(orig!.id!)
      expectNoExchange(actual, check, orig!)
    })

    it('does nothing if the user is inactive', async () => {
      const orig = await repository.save(token)
      await roles.revoke(uid, 'active')
      const actual = await repository.exchange(orig!)
      expectNoExchange(actual, orig!, orig!)
    })
  })

  describe('list', () => {
    it('returns an empty list if there are no records', async () => {
      const actual = await repository.list()
      expect(actual).toEqual({ total: 0, rows: [] })
    })

    it('returns all existing records', async () => {
      await repository.save(token)
      const actual = await repository.list()
      expect(actual.total).toBe(1)
      expect(actual.rows).toHaveLength(1)
    })

    it('paginates results', async () => {
      await repository.save(token)
      await repository.save(token)

      const scenarios = [
        await repository.list(1, 0),
        await repository.list(1, 1)
      ]

      for (const { total, rows } of scenarios) {
        expect(total).toBe(2)
        expect(rows).toHaveLength(1)
        expect(rows[0].uid).toBe(uid)
        expect(rows[0].refresh).toBe(token.refresh)
        expect(rows[0].token_expiration).toEqual(token.token_expiration)
        expect(rows[0].refresh_expiration).toEqual(token.refresh_expiration)
      }
    })
  })

  describe('listByUserID', () => {
    let otherUser: User
    let otherToken: AuthTokenRecord

    beforeEach(async () => {
      otherUser = await users.save({ name: 'Jane Doe' }) as User
      otherToken = userToAuthTokenRecord(otherUser)
    })

    it('lists records with given user ID', async () => {
      token = await repository.save(token) as AuthTokenRecord
      otherToken = await repository.save(otherToken) as AuthTokenRecord
      const actual = await repository.listByUserID(uid)
      expect(actual.total).toBe(1)
      expect(actual.rows).toHaveLength(1)
      expect(actual.rows[0].uid).toBe(uid)
      expect(actual.rows[0].id).toBe(token.id)
    })
  })
})
