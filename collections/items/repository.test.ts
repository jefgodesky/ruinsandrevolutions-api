import { describe, beforeAll, beforeEach, afterAll, afterEach, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type User from '../../types/user.ts'
import ItemRecord, { createItemRecord } from '../../types/item-record.ts'
import DB from '../../DB.ts'
import setupUser from '../../utils/testing/setup-user.ts'
import ItemRepository from './repository.ts'

describe('ItemRepository', () => {
  let repository: ItemRepository
  let authors: User[]

  beforeAll(() => {
    repository = new ItemRepository()
  })

  beforeEach(async () => {
    const { user } = await setupUser({ createAccount: false, createToken: false })
    authors = [user]
  })

  afterAll(DB.close)
  afterEach(DB.clear)

  describe('create', () => {
    it('creates a new item', async () => {
      const orig = createItemRecord({ id: undefined })
      const actual = await repository.save(orig, authors)
      const itemCheck = await DB.query<ItemRecord>('SELECT * FROM items')
      const authorCheck = await DB.query<{ id: string }>('SELECT id FROM item_authors')

      expect(actual?.id).toBeDefined()
      expect(actual?.name).toBe(orig.name)
      expect(itemCheck.rowCount).toBe(1)
      expect(authorCheck.rowCount).toBe(1)
    })

    it('creates a new item with multiple authors', async () => {
      const { user } = await setupUser({ createAccount: false, createToken: false })
      authors.push(user)
      await repository.save(createItemRecord({ id: undefined }), authors)
      const authorCheck = await DB.query<{ id: string }>('SELECT id FROM item_authors')
      expect(authorCheck.rowCount).toBe(2)
    })
  })
})
