import { describe, beforeAll, beforeEach, afterAll, afterEach, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type User from '../../../types/user.ts'
import DB from '../../../DB.ts'
import getRoleConfig from '../../../utils/get-role-config.ts'
import setupUser from '../../../utils/testing/setup-user.ts'
import RolesRepository from './repository.ts'

describe('RolesRepository', () => {
  let repository: RolesRepository
  let user: User

  beforeAll(() => {
    repository = new RolesRepository()
  })

  beforeEach(async () => {
    ({ user } = await setupUser({ createAccount: false, createToken: false }))
  })

  afterAll(DB.close)
  afterEach(DB.clear)

  describe('get', () => {
    it('returns null if not given a UUID', async () => {
      const actual = await repository.get('nope')
      expect(actual).toBeNull()
    })

    it('returns null if no such user exists', async () => {
      const actual = await repository.get(crypto.randomUUID())
      expect(actual).toBeNull()
    })

    it('returns a user\'s roles', async () => {
      const roles = await repository.get(user.id!)
      expect(roles).toEqual(getRoleConfig().default)
    })
  })

  describe('has', () => {
    it('returns null if not given a UUID', async () => {
      const actual = await repository.has('nope', 'active')
      expect(actual).toBeNull()
    })

    it('returns null if no such user exists', async () => {
      const actual = await repository.has(crypto.randomUUID(), 'active')
      expect(actual).toBeNull()
    })

    it('returns true if the user has that role', async () => {
      const actual = await repository.has(user.id!, 'active')
      expect(actual).toBe(true)
    })

    it('returns false if the user does not have that role', async () => {
      const actual = await repository.has(user.id!, 'admin')
      expect(actual).toBe(false)
    })
  })

  describe('grant', () => {
    it('returns false if not given a UUID', async () => {
      const actual = await repository.grant('nope', 'admin')
      expect(actual).toBeNull()
    })

    it('returns null if no such user exists', async () => {
      const actual = await repository.grant(crypto.randomUUID(), 'admin')
      expect(actual).toBeNull()
    })

    it('adds a new role', async () => {
      const actual = await repository.grant(user.id!, 'admin')
      const roles = await repository.get(user.id!)
      expect(actual).toBe(true)
      expect(roles).toEqual([...getRoleConfig().default, 'admin'])
    })

    it('won\'t create duplicate roles', async () => {
      const actual = await repository.grant(user.id!, 'active')
      const check = await DB.query('SELECT * FROM roles WHERE uid = $1', [user.id!])
      expect(actual).toBe(true)
      expect(check.rowCount).toBe(getRoleConfig().default.length)
    })
  })

  describe('revoke', () => {
    it('returns null if not given a UUID', async () => {
      const actual = await repository.revoke('nope', 'active')
      expect(actual).toBeNull()
    })

    it('returns null if no such user exists', async () => {
      const actual = await repository.revoke(crypto.randomUUID(), 'active')
      expect(actual).toBeNull()
    })

    it('revokes a role', async () => {
      const actual = await repository.revoke(user.id!, 'active')
      const roles = await repository.get(user.id!)
      expect(actual).toBe(true)
      expect(roles).toEqual(getRoleConfig().default.filter(role => role !== 'active'))
    })
  })
})
