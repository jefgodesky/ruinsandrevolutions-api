import { describe, beforeAll, afterEach, afterAll, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type User from './types/user.ts'
import UserRepository from './collections/users/repository.ts'
import DB from './DB.ts'

describe('DB', () => {
  let users: UserRepository

  beforeAll(() => {
    users = new UserRepository()
  })

  afterEach(async () => {
    await DB.clear()
  })

  afterAll(async () => {
    await DB.close()
  })

  describe('exists', () => {
    it('returns false if no such record exists', async () => {
      const actual = await DB.exists('SELECT * FROM users WHERE id = $1', [crypto.randomUUID()])
      expect(actual).toBe(false)
    })

    it('returns true if the record exists ', async () => {
      const user = await users.save({ name: 'John Doe' })
      const actual = await DB.exists('SELECT * FROM users WHERE id = $1', [user?.id!])
      expect(actual).toBe(true)
    })
  })

  describe('get', () => {
    it('returns null if no such record exists', async () => {
      const actual = await DB.get<User>('SELECT * FROM users WHERE id = $1', [crypto.randomUUID()])
      expect(actual).toBeNull()
    })

    it('returns the record ', async () => {
      const user = await users.save({ name: 'John Doe' })
      const actual = await DB.get<User>('SELECT * FROM users WHERE id = $1', [user?.id!])
      expect(actual?.id).toBe(user?.id)
    })
  })

  describe('list', () => {
    it('returns an empty list if there are no records', async () => {
      const actual = await DB.list('users')
      expect(actual).toEqual({ total: 0, rows: [] })
    })

    it('returns all existing records', async () => {
      await users.save({ name: 'John Doe' })
      await users.save({ name: 'Jane Doe' })
      const actual = await DB.list('users')
      expect(actual.total).toBe(2)
      expect(actual.rows).toHaveLength(2)
    })

    it('can add a where clause', async () => {
      const name = 'John Doe'
      await users.save({ name })
      await users.save({ name: 'Jane Doe' })
      const actual = await DB.list('users', { where: 'name = $1', params: [name] })
      expect(actual.total).toBe(1)
      expect(actual.rows).toHaveLength(1)
    })

    it('can add a sort clause', async () => {
      const names = ['Alice', 'Bob', 'Charlie']
      for (const name of names) {
        await users.save({ name })
      }

      const actual = await DB.list('users', { sort: 'name ASC' })
      expect(actual.total).toBe(3)
      for (let i = 0; i < names.length; i++) {
        expect((actual.rows[i] as User)?.name).toBe(names[i])
      }
    })

    it('paginates results', async () => {
      const john = await users.save({ name: 'John Doe' }) as User
      const jane = await users.save({ name: 'Jane Doe' }) as User
      const p1 = await DB.list<User>('users', { offset: 0, limit: 1 })
      const p2 = await DB.list<User>('users', { offset: 1, limit: 1 })
      const scenarios: [{ total: number, rows: User[] }, User][] = [[p1, john], [p2, jane]]
      for (const [result, user] of scenarios) {
        expect(result.total).toBe(2)
        expect(result.rows).toHaveLength(1)
        expect(result.rows[0].name).toBe(user.name)
      }
    })
  })
})
