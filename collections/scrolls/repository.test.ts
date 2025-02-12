import { describe, beforeAll, beforeEach, afterAll, afterEach, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type Scroll from '../../types/scroll.ts'
import type ItemRecord from '../../types/item-record.ts'
import type User from '../../types/user.ts'
import { isScroll } from '../../types/scroll.ts'
import { createScrollCreation } from '../../types/scroll-creation.ts'
import DB from '../../DB.ts'
import setupScrolls from '../../utils/testing/setup-scrolls.ts'
import setupUser from '../../utils/testing/setup-user.ts'
import ScrollRepository from './repository.ts'

describe('ScrollRepository', () => {
  let repository: ScrollRepository
  let authors: User[]

  beforeAll(() => {
    repository = new ScrollRepository()
  })

  beforeEach(async () => {
    const { user } = await setupUser({ createAccount: false, createToken: false })
    authors = [user]
  })

  afterAll(DB.close)
  afterEach(DB.clear)

  describe('create', () => {
    it('creates a new scroll', async () => {
      const post = createScrollCreation(undefined, authors)
      const actual = await repository.create(post)
      const itemCheck = await DB.query<ItemRecord>('SELECT * FROM items')
      const authorCheck = await DB.query<{ id: string }>('SELECT id FROM item_authors')

      expect(isScroll(actual)).toBe(true)
      expect(actual?.id).toBeDefined()
      expect(actual?.name).toBe(post.data.attributes.name)
      expect(itemCheck.rowCount).toBe(1)
      expect(authorCheck.rowCount).toBe(1)
    })

    it('creates a new item with multiple authors', async () => {
      const { user } = await setupUser({ createAccount: false, createToken: false })
      authors.push(user)
      await repository.create(createScrollCreation(undefined, authors))
      const authorCheck = await DB.query<{ id: string }>('SELECT id FROM item_authors')
      expect(authorCheck.rowCount).toBe(2)
    })
  })

  describe('get', () => {
    it('returns null if item does not exist', async () => {
      const actual = await repository.get(crypto.randomUUID())
      expect(actual).toBeNull()
    })

    it('returns null if slug does not exist', async () => {
      const actual = await repository.get('nope')
      expect(actual).toBeNull()
    })

    it('returns a single item by ID', async () => {
      const { scrolls } = await setupScrolls(1)
      const actual = await repository.get(scrolls[0].id!)
      expect(actual?.id).toBe(scrolls[0].id)
    })

    it('returns a single item by slug', async () => {
      const { scrolls } = await setupScrolls(1)
      const actual = await repository.get(scrolls[0].slug!)
      expect(actual?.id).toBe(scrolls[0].id)
    })
  })

  describe('list', () => {
    it('returns an empty list if there are no scrolls', async () => {
      const actual = await repository.list()
      expect(actual).toEqual({ total: 0, rows: [] })
    })

    it('returns all existing scrolls', async () => {
      await setupScrolls(3)
      const actual = await repository.list()
      expect(actual.total).toBe(3)
      expect(actual.rows).toHaveLength(3)
    })

    it('paginates results', async () => {
      const { scrolls } = await setupScrolls(3)
      const p1 = await repository.list(1, 0)
      const p2 = await repository.list(1, 1)

      expect(p1.total).toBe(3)
      expect(p1.rows.map((scroll: Scroll) => scroll.id!)).toEqual([scrolls[scrolls.length - 1].id])

      expect(p2.total).toBe(3)
      expect(p2.rows.map((scroll: Scroll) => scroll.id!)).toEqual([scrolls[scrolls.length - 2].id])
    })
  })
})
