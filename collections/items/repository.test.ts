import { describe, beforeAll, beforeEach, afterAll, afterEach, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type User from '../../types/user.ts'
import ItemRecord, { type ItemRecordWithAuthors, createItemRecord } from '../../types/item-record.ts'
import DB from '../../DB.ts'
import RoleRepository from '../users/roles/repository.ts'
import setupScales from '../../utils/testing/setup-scales.ts'
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

  describe('get', () => {
    it('returns null if ID is not a UUID', async () => {
      const actual = await repository.get('nope')
      expect(actual).toBeNull()
    })

    it('returns a single item by ID', async () => {
      const { scales } = await setupScales(1)
      const actual = await repository.get(scales[0].id!)
      expect(actual?.id).toBe(scales[0].id)
      expect(actual?.authors).toHaveLength(1)
    })

    it('does not include unlisted authors', async () => {
      const { scales } = await setupScales(1)
      const roles = new RoleRepository()
      await roles.revoke(scales[0].authors[0].id!, 'listed')
      const actual = await repository.get(scales[0].id!)
      expect(actual?.authors).toHaveLength(0)
    })
  })

  describe('getBySlug', () => {
    it('returns null if slug does not exist', async () => {
      const actual = await repository.getBySlug('scale', 'nope')
      expect(actual).toBeNull()
    })

    it('returns a single item by slug', async () => {
      const { scales } = await setupScales(1)
      const actual = await repository.getBySlug('scale', scales[0].slug!)
      expect(actual?.id).toBe(scales[0].id)
      expect(actual?.authors).toHaveLength(1)
    })

    it('does not include unlisted authors', async () => {
      const { scales } = await setupScales(1)
      const roles = new RoleRepository()
      await roles.revoke(scales[0].authors[0].id!, 'listed')
      const actual = await repository.getBySlug('scale', scales[0].slug!)
      expect(actual?.authors).toHaveLength(0)
    })
  })

  describe('getByIdOrSlug', () => {
    it('returns null if item does not exist', async () => {
      const actual = await repository.getByIdOrSlug('scale', crypto.randomUUID())
      expect(actual).toBeNull()
    })

    it('returns null if slug does not exist', async () => {
      const actual = await repository.getByIdOrSlug('scale', 'nope')
      expect(actual).toBeNull()
    })

    it('returns a single item by ID', async () => {
      const { scales } = await setupScales(1)
      const actual = await repository.getByIdOrSlug('scale', scales[0].id!)
      expect(actual?.id).toBe(scales[0].id)
      expect(actual?.authors).toHaveLength(1)
    })

    it('returns a single item by slug', async () => {
      const { scales } = await setupScales(1)
      const actual = await repository.getByIdOrSlug('scale', scales[0].slug!)
      expect(actual?.id).toBe(scales[0].id)
      expect(actual?.authors).toHaveLength(1)
    })
  })

  describe('list', () => {
    it('returns an empty list if there are no records', async () => {
      const actual = await repository.list()
      expect(actual).toEqual({ total: 0, rows: [] })
    })

    it('returns all existing records', async () => {
      await setupScales(3)
      const actual = await repository.list()
      expect(actual.total).toBe(3)
      expect(actual.rows).toHaveLength(3)
    })

    it('paginates results', async () => {
      const { scales } = await setupScales(3)
      const p1 = await repository.list(1, 0)
      const p2 = await repository.list(1, 1)

      expect(p1.total).toBe(3)
      expect(p1.rows.map((scale: ItemRecordWithAuthors) => scale.id!)).toEqual([scales[scales.length - 1].id])

      expect(p2.total).toBe(3)
      expect(p2.rows.map((scale: ItemRecordWithAuthors) => scale.id!)).toEqual([scales[scales.length - 2].id])
    })
  })
})
