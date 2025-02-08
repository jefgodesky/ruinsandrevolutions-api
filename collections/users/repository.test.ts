import { describe, beforeAll, afterAll, afterEach, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type User from '../../types/user.ts'
import DB from '../../DB.ts'
import RoleRepository from './roles/repository.ts'
import UserRepository from './repository.ts'
import getRoleConfig from '../../utils/get-role-config.ts'
import setupUser from '../../utils/testing/setup-user.ts'

describe('UserRepository', () => {
  let repository: UserRepository
  let roles: RoleRepository

  beforeAll(() => {
    repository = new UserRepository()
    roles = new RoleRepository()
  })

  afterAll(DB.close)
  afterEach(DB.clear)

  const populateTestUsers = async (n: number = 2): Promise<User[]> => {
    const users: User[] = []
    for (let i = 0; i < n; i++) {
      const { user } = await setupUser({ createAccount: false, createToken: false })
      users.push(user)
    }
    return users
  }

  describe('save', () => {
    it('can create a new user', async () => {
      const { user } = await setupUser({ createAccount: false, createToken: false })
      const { total, rows } = await repository.list()
      const savedRoles = await roles.get(user.id!)

      expect(user.id).toBeDefined()
      expect(total).toBe(1)
      expect(rows).toHaveLength(1)
      expect(rows[0].id).toBe(user.id)
      expect(savedRoles).toEqual(getRoleConfig().default)
    })

    it('can update an existing user', async () => {
      const newUsername = 'johnny'
      const { user } = await setupUser({ createAccount: false, createToken: false })
      user.username = newUsername
      await repository.save(user)
      const { total, rows } = await repository.list()

      expect(user.username).toBe(newUsername)
      expect(total).toBe(1)
      expect(rows).toHaveLength(1)
      expect(rows[0].username).toBe(newUsername)
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
      const { user } = await setupUser({ createAccount: false, createToken: false })
      const actual = await repository.get(user.id!)
      expect(actual).not.toBeNull()
      expect(actual?.id).toBe(user.id)
      expect(actual?.username).toBe(user.username)
    })
  })

  describe('getByUsername', () => {
    it('returns null if given a username that is too long', async () => {
      let name = ''
      for (let i = 0; i < 260; i++) name = `${name}a`
      const actual = await repository.getByUsername(name)
      expect(actual).toBeNull()
    })

    it('returns null if nothing matches', async () => {
      const actual = await repository.getByUsername('lol-nope')
      expect(actual).toBeNull()
    })

    it('returns a single record based on username', async () => {
      const { user } = await setupUser({ createAccount: false, createToken: false })
      const actual = await repository.getByUsername(user.username!)
      expect(actual).not.toBeNull()
      expect(actual?.id).toBe(user.id)
      expect(actual?.username).toBe(user.username)
    })
  })

  describe('getByIdOrUsername', () => {
    it('returns null if given a username that is too long', async () => {
      let name = ''
      for (let i = 0; i < 260; i++) name = `${name}a`
      const actual = await repository.getByIdOrUsername(name)
      expect(actual).toBeNull()
    })

    it('returns null if nothing matches (ID)', async () => {
      const actual = await repository.getByIdOrUsername(crypto.randomUUID())
      expect(actual).toBeNull()
    })

    it('returns null if nothing matches (username)', async () => {
      const actual = await repository.getByIdOrUsername('lol-nope')
      expect(actual).toBeNull()
    })

    it('returns a single record based on ID', async () => {
      const { user } = await setupUser({ createAccount: false, createToken: false })
      const actual = await repository.getByIdOrUsername(user.id!)
      expect(actual).not.toBeNull()
      expect(actual?.id).toBe(user.id)
      expect(actual?.username).toBe(user.username)
    })

    it('returns a single record based on username', async () => {
      const { user } = await setupUser({ createAccount: false, createToken: false })
      const actual = await repository.getByIdOrUsername(user.username!)
      expect(actual).not.toBeNull()
      expect(actual?.id).toBe(user.id)
      expect(actual?.username).toBe(user.username)
    })
  })

  describe('list', () => {
    it('returns an empty list if there are no records', async () => {
      const actual = await repository.list()
      expect(actual).toEqual({ total: 0, rows: [] })
    })

    it('returns all existing records', async () => {
      await populateTestUsers(2)
      const actual = await repository.list()
      expect(actual.total).toBe(2)
      expect(actual.rows).toHaveLength(2)
    })

    it('paginates results', async () => {
      const users = await populateTestUsers(2)
      const p1 = await repository.list(1, 0)
      const p2 = await repository.list(1, 1)
      const scenarios: [{ total: number, rows: User[] }, string][] = [[p1, users[0].name], [p2, users[1].name]]
      for (const [result, name] of scenarios) {
        expect(result.total).toBe(2)
        expect(result.rows).toHaveLength(1)
        expect(result.rows[0].name).toBe(name)
      }
    })

    it('does not include users without the listed role', async () => {
      const { user } = await setupUser({ createAccount: false, createToken: false })
      await roles.revoke(user.id!, 'listed')
      const actual = await repository.list()
      expect(actual.total).toBe(0)
      expect(actual.rows).toHaveLength(0)
    })
  })
})
