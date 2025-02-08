import { describe, beforeAll, beforeEach, afterAll, afterEach, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type User from '../../types/user.ts'
import { createScale, isScale } from '../../types/scale.ts'
import ItemRecord from '../../types/item-record.ts'
import DB from '../../DB.ts'
import setupUser from '../../utils/testing/setup-user.ts'
import ScaleRepository from './repository.ts'
import UserRepository from '../users/repository.ts'

describe('ScaleRepository', () => {
  let repository: ScaleRepository
  let authors: User[]

  beforeAll(() => {
    repository = new ScaleRepository()
  })

  beforeEach(async () => {
    const { user } = await setupUser({ createAccount: false, createToken: false })
    authors = [user]
  })

  afterAll(DB.close)
  afterEach(DB.clear)

  describe('create', () => {
    it('creates a new scale', async () => {
      const orig = createScale({ id: undefined, authors })
      const actual = await repository.save(orig)
      const itemCheck = await DB.query<ItemRecord>('SELECT * FROM items')
      const authorCheck = await DB.query<{ id: string }>('SELECT id FROM item_authors')

      expect(isScale(actual)).toBe(true)
      expect(actual?.id).toBeDefined()
      expect(actual?.name).toBe(orig.name)
      expect(itemCheck.rowCount).toBe(1)
      expect(authorCheck.rowCount).toBe(1)
    })

    it('creates a new item with multiple authors', async () => {
      const { user } = await setupUser({ createAccount: false, createToken: false })
      authors.push(user)
      await repository.save(createScale({ id: undefined, authors }))
      const authorCheck = await DB.query<{ id: string }>('SELECT id FROM item_authors')
      expect(authorCheck.rowCount).toBe(2)
    })
  })
})
