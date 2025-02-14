import { describe, beforeEach, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import { createMockContext } from '@oak/oak/testing'
import type Resource from '../../types/resource.ts'
import type Response from '../../types/response.ts'
import { createTable } from '../../types/table.ts'
import TableAttributes, { createTableAttributes } from '../../types/table-attributes.ts'
import TableCreation, { createTableCreation } from '../../types/table-creation.ts'
import type TableResource from '../../types/table-resource.ts'
import User, { createUser } from '../../types/user.ts'
import UserAttributes, { createUserAttributes } from '../../types/user-attributes.ts'
import type UserResource from '../../types/user-resource.ts'
import DB from '../../DB.ts'
import { createFields } from '../../types/fields.ts'
import setupUser from '../../utils/testing/setup-user.ts'
import getAllFieldCombinations from '../../utils/testing/get-all-field-combinations.ts'
import getRoot from '../../utils/get-root.ts'
import TableController from './controller.ts'

describe('TableController', () => {
  let user: User

  beforeEach(async () => {
    ({ user } = await setupUser({ createToken: false, createAccount: false }))
  })

  afterEach(DB.clear)
  afterAll(DB.close)

  describe('create', () => {
    const applyCreate = async (post: TableCreation, url?: URL): Promise<Response> => {
      const ctx = createMockContext({
        state: { client: user, itemCreation: post }
      })
      await TableController.create(ctx, url)
      expect(ctx.response.status).toBe(200)
      return ctx.response.body as Response
    }

    it('creates a table', async () => {
      const post = createTableCreation(undefined, [user])
      const response = await applyCreate(post)
      const relationships = (response.data as TableResource).relationships
      const attributes = (response.data as TableResource).attributes as TableAttributes
      const copiedFields: Array<keyof TableAttributes> = ['name', 'description', 'body', 'attribution']

      expect(relationships?.authors?.data).toHaveLength(1)
      expect((relationships?.authors?.data as UserResource[])[0].id).toBe(user.id)
      for (const field of copiedFields) {
        expect(attributes[field]).toBe(post.data.attributes[field])
      }
    })

    it('returns a sparse fieldset', async () => {
      const objects = getAllFieldCombinations(createTableAttributes())
      for (const [index, object] of objects.entries()) {
        const fields = createFields({ tables: Object.keys(object) as (keyof TableAttributes)[] })
        const url = new URL(`${getRoot()}/tables?fields[tables]=${fields.tables.join(',')}`)
        const post = createTableCreation({ slug: `test-${index + 1}` }, [user])
        const response = await applyCreate(post, url)
        const data = response.data as TableResource
        const attributes = data.attributes as TableAttributes

        for (const field of fields.tables) {
          const key = field as keyof TableAttributes
          expect(attributes[key] === undefined).toBe(object[key] === undefined)
        }
      }
    })

    it('returns a sparse fieldset (authors)', async () => {
      const objects = getAllFieldCombinations(createUserAttributes())
      for (const [index, object] of objects.entries()) {
        const fields = createFields({ users: Object.keys(object) as (keyof UserAttributes)[] })
        const url = new URL(`${getRoot()}/tables?fields[users]=${fields.users.join(',')}`)
        const post = createTableCreation({ slug: `test-${index + 1}` }, [user])
        const response = await applyCreate(post, url)
        const included = response.included as Resource[]
        const authors = included.filter(item => item.type === 'users') as UserResource[]
        const authorAttributes = authors.map(author => author.attributes).filter(attr => attr !== undefined)

        for (const author of authorAttributes) {
          for (const field of fields.users) {
            expect(author[field] === undefined).toBe(object[field] === undefined)
          }
        }
      }
    })
  })

  describe('get', () => {
    const userAttributes = createUserAttributes()
    const user = createUser({ ...userAttributes })
    const attributes = createTableAttributes()
    const table = createTable({ ...attributes, authors: [user] })
    const ctx = createMockContext({ state: { table } })

    it('returns the table', () => {
      TableController.get(ctx)
      const data = (ctx.response.body as Response)?.data as TableResource
      expect(ctx.response.status).toBe(200)
      expect(data).toBeDefined()
      expect(data.type).toBe('tables')
      expect(data.attributes).toHaveProperty('name', table.name)
    })

    it('returns a sparse fieldset', () => {
      const objects = getAllFieldCombinations(attributes)
      for (const object of objects) {
        const fields = Object.keys(object) as (keyof TableAttributes)[]
        const url = new URL(`${getRoot()}/tables/${table.id}?fields[tables]=${fields.join(',')}`)
        TableController.get(ctx, url)
        const data = (ctx.response.body as Response)?.data as TableResource
        const receivedAttributes = data.attributes as TableAttributes

        expect(ctx.response.status).toBe(200)
        for (const field of fields) {
          expect(receivedAttributes[field]).toEqual(object[field])
        }
      }
    })

    it('returns a sparse fieldset (authors)', () => {
      const objects = getAllFieldCombinations(userAttributes)
      for (const object of objects) {
        const fields = Object.keys(object) as (keyof UserAttributes)[]
        const url = new URL(`${getRoot()}/tables/${table.id}?fields[users]=${fields.join(',')}`)
        TableController.get(ctx, url)
        const included = (ctx.response.body as Response)?.included as Resource[]
        const authors = included.filter(item => item.type === 'users') as UserResource[]
        const authorAttributes = authors.map(author => author.attributes).filter(attr => attr !== undefined)

        expect(ctx.response.status).toBe(200)
        for (const author of authorAttributes) {
          for (const field of fields) {
            expect(author[field]).toEqual(object[field])
          }
        }
      }
    })
  })
})
