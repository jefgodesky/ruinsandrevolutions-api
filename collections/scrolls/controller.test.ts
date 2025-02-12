import { describe, beforeEach, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import { createMockContext } from '@oak/oak/testing'
import type Resource from '../../types/resource.ts'
import type Response from '../../types/response.ts'
import { createScroll } from '../../types/scroll.ts'
import ScrollAttributes, { createScrollAttributes } from '../../types/scroll-attributes.ts'
import ScrollCreation, { createScrollCreation } from '../../types/scroll-creation.ts'
import type ScrollResource from '../../types/scroll-resource.ts'
import User, {createUser} from '../../types/user.ts'
import UserAttributes, { createUserAttributes } from '../../types/user-attributes.ts'
import type UserResource from '../../types/user-resource.ts'
import DB from '../../DB.ts'
import { createFields } from '../../types/fields.ts'
import setupUser from '../../utils/testing/setup-user.ts'
import getAllFieldCombinations from '../../utils/testing/get-all-field-combinations.ts'
import getRoot from '../../utils/get-root.ts'
import ScrollController from './controller.ts'

describe('ScrollController', () => {
  let user: User

  beforeEach(async () => {
    ({ user } = await setupUser({ createToken: false, createAccount: false }))
  })

  afterEach(DB.clear)
  afterAll(DB.close)

  describe('create', () => {
    const applyCreate = async (post: ScrollCreation, url?: URL): Promise<Response> => {
      const ctx = createMockContext({
        state: { client: user, itemCreation: post }
      })
      await ScrollController.create(ctx, url)
      expect(ctx.response.status).toBe(200)
      return ctx.response.body as Response
    }

    it('creates a scroll', async () => {
      const post = createScrollCreation(undefined, [user])
      const response = await applyCreate(post)
      const relationships = (response.data as ScrollResource).relationships
      const attributes = (response.data as ScrollResource).attributes as ScrollAttributes
      const copiedFields: Array<keyof ScrollAttributes> = ['name', 'description', 'body', 'attribution']

      expect(relationships?.authors?.data).toHaveLength(1)
      expect((relationships?.authors?.data as UserResource[])[0].id).toBe(user.id)
      for (const field of copiedFields) {
        expect(attributes[field]).toBe(post.data.attributes[field])
      }
    })

    it('returns a sparse fieldset', async () => {
      const objects = getAllFieldCombinations(createScrollAttributes())
      for (const [index, object] of objects.entries()) {
        const fields = createFields({ scrolls: Object.keys(object) as (keyof ScrollAttributes)[] })
        const url = new URL(`${getRoot()}/scrolls?fields[scrolls]=${fields.scrolls.join(',')}`)
        const post = createScrollCreation({ slug: `test-${index + 1}` }, [user])
        const response = await applyCreate(post, url)
        const data = response.data as ScrollResource
        const attributes = data.attributes as ScrollAttributes

        for (const field of fields.scrolls) {
          const key = field as keyof ScrollAttributes
          expect(attributes[key] === undefined).toBe(object[key] === undefined)
        }
      }
    })

    it('returns a sparse fieldset (authors)', async () => {
      const objects = getAllFieldCombinations(createUserAttributes())
      for (const [index, object] of objects.entries()) {
        const fields = createFields({ users: Object.keys(object) as (keyof UserAttributes)[] })
        const url = new URL(`${getRoot()}/scales?fields[users]=${fields.users.join(',')}`)
        const post = createScrollCreation({ slug: `test-${index + 1}` }, [user])
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
    const attributes = createScrollAttributes()
    const scroll = createScroll({ ...attributes, authors: [user] })
    const ctx = createMockContext({ state: { scroll } })

    it('returns the scroll', () => {
      ScrollController.get(ctx)
      const data = (ctx.response.body as Response)?.data as ScrollResource
      expect(ctx.response.status).toBe(200)
      expect(data).toBeDefined()
      expect(data.type).toBe('scrolls')
      expect(data.attributes).toHaveProperty('name', scroll.name)
    })

    it('returns a sparse fieldset', () => {
      const objects = getAllFieldCombinations(attributes)
      for (const object of objects) {
        const fields = Object.keys(object) as (keyof ScrollAttributes)[]
        const url = new URL(`${getRoot()}/scrolls/${scroll.id}?fields[scrolls]=${fields.join(',')}`)
        ScrollController.get(ctx, url)
        const data = (ctx.response.body as Response)?.data as ScrollResource
        const receivedAttributes = data.attributes as ScrollAttributes

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
        const url = new URL(`${getRoot()}/scrolls/${scroll.id}?fields[users]=${fields.join(',')}`)
        ScrollController.get(ctx, url)
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
