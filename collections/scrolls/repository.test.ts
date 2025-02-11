import { describe, beforeAll, beforeEach, afterAll, afterEach, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type User from '../../types/user.ts'
import { isScroll } from '../../types/scroll.ts'
import { createScrollCreation } from '../../types/scroll-creation.ts'
import ItemRecord from '../../types/item-record.ts'
import DB from '../../DB.ts'
import setupScrolls from '../../utils/testing/setup-scrolls.ts'
import setupUser from '../../utils/testing/setup-user.ts'
import ScrollRepository from './repository.ts'
import setupScales from '../../utils/testing/setup-scales.ts'

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
})
