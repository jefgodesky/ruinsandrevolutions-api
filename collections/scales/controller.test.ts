import { describe, beforeEach, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import { type Context } from '@oak/oak'
import { createMockContext } from '@oak/oak/testing'
import type Resource from '../../types/resource.ts'
import type Response from '../../types/response.ts'
import type Scale from '../../types/scale.ts'
import ScaleAttributes, { createScaleAttributes } from '../../types/scale-attributes.ts'
import ScaleCreation, { createScaleCreation } from '../../types/scale-creation.ts'
import type ScaleResource from '../../types/scale-resource.ts'
import type ScalePatch from '../../types/scale-patch.ts'
import User, { createUser } from '../../types/user.ts'
import UserAttributes, { createUserAttributes } from '../../types/user-attributes.ts'
import type UserResource from '../../types/user-resource.ts'
import DB from '../../DB.ts'
import { createFields } from '../../types/fields.ts'
import { createScale } from '../../types/scale.ts'
import setupScales from '../../utils/testing/setup-scales.ts'
import setupUser from '../../utils/testing/setup-user.ts'
import stringToReadableStream from '../../utils/transformers/string-to/readable-stream.ts'
import getAllFieldCombinations from '../../utils/testing/get-all-field-combinations.ts'
import getRoot from '../../utils/get-root.ts'
import ScaleController from './controller.ts'

describe('ScaleController', () => {
  let user: User

  beforeEach(async () => {
    ({ user } = await setupUser({ createToken: false, createAccount: false }))
  })

  afterEach(DB.clear)
  afterAll(DB.close)

  describe('create', () => {
    const applyCreate = async (post: ScaleCreation, url?: URL): Promise<Response> => {
      const ctx = createMockContext({
        state: { client: user },
        body: stringToReadableStream(JSON.stringify(post))
      })
      await ScaleController.create(ctx, url)
      expect(ctx.response.status).toBe(200)
      return ctx.response.body as Response
    }

    it('creates a scale', async () => {
      const post = createScaleCreation(undefined, [user])
      const response = await applyCreate(post)
      const relationships = (response.data as ScaleResource).relationships
      const attributes = (response.data as ScaleResource).attributes as ScaleAttributes
      const copiedFields: Array<keyof ScaleAttributes> = ['name', 'description', 'body', 'attribution']

      expect(relationships?.authors?.data).toHaveLength(1)
      expect((relationships?.authors?.data as UserResource[])[0].id).toBe(user.id)
      for (const field of copiedFields) {
        expect(attributes[field]).toBe(post.data.attributes[field])
      }
    })

    it('returns a sparse fieldset', async () => {
      const objects = getAllFieldCombinations(createScaleAttributes())
      for (const [index, object] of objects.entries()) {
        const fields = createFields({ scales: Object.keys(object) as (keyof ScaleAttributes)[] })
        const url = new URL(`${getRoot()}/scales?fields[scales]=${fields.scales.join(',')}`)
        const post = createScaleCreation({ slug: `test-${index + 1}` }, [user])
        const response = await applyCreate(post, url)
        const data = response.data as ScaleResource
        const attributes = data.attributes as ScaleAttributes

        for (const field of fields.scales) {
          const key = field as keyof ScaleAttributes
          expect(attributes[key] === undefined).toBe(object[key] === undefined)
        }
      }
    })

    it('returns a sparse fieldset (authors)', async () => {
      const objects = getAllFieldCombinations(createUserAttributes())
      for (const [index, object] of objects.entries()) {
        const fields = createFields({ users: Object.keys(object) as (keyof UserAttributes)[] })
        const url = new URL(`${getRoot()}/scales?fields[users]=${fields.users.join(',')}`)
        const post = createScaleCreation({ slug: `test-${index + 1}` }, [user])
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
    const attributes = createScaleAttributes()
    const scale = createScale({ ...attributes, authors: [user] })
    const ctx = createMockContext({ state: { scale } })

    it('returns the scale', () => {
      ScaleController.get(ctx)
      const data = (ctx.response.body as Response)?.data as ScaleResource
      expect(ctx.response.status).toBe(200)
      expect(data).toBeDefined()
      expect(data.type).toBe('scales')
      expect(data.attributes).toHaveProperty('name', scale.name)
    })

    it('returns a sparse fieldset', () => {
      const objects = getAllFieldCombinations(attributes)
      for (const object of objects) {
        const fields = Object.keys(object) as (keyof ScaleAttributes)[]
        const url = new URL(`${getRoot()}/scales/${scale.id}?fields[scales]=${fields.join(',')}`)
        ScaleController.get(ctx, url)
        const data = (ctx.response.body as Response)?.data as ScaleResource
        const receivedAttributes = data.attributes as ScaleAttributes

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
        const url = new URL(`${getRoot()}/scales/${scale.id}?fields[users]=${fields.join(',')}`)
        ScaleController.get(ctx, url)
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

  describe('list', () => {
    it('shows your scales', async () => {
      const { user, scales } = await setupScales(3)
      const ctx = createMockContext({ state: { client: user } })
      await ScaleController.list(ctx)
      const data = (ctx.response.body as Response)?.data as ScaleResource[]

      expect(ctx.response.status).toBe(200)
      expect(data).toHaveLength(3)
      for (const [index, expected] of scales.reverse().entries()) {
        expect(data[index].type).toBe('scales')
        expect(data[index].id).toBe(expected.id)
        expect(data[index].attributes).toHaveProperty('name', expected.name)
      }
    })

    it('can be sorted', async () => {
      const { user } = await setupScales(3, ['C', 'A', 'B'])
      const ctx = createMockContext({ state: { client: user } })
      const url = new URL('http://localhost:8001/v1/scales?sort=name')
      await ScaleController.list(ctx, url)
      const data = (ctx.response.body as Response)?.data as ScaleResource[]

      expect(ctx.response.status).toBe(200)
      expect(data).toHaveLength(3)
      expect(data[0].attributes).toHaveProperty('name', 'A')
      expect(data[1].attributes).toHaveProperty('name', 'B')
      expect(data[2].attributes).toHaveProperty('name', 'C')
    })

    it('can be filtered', async () => {
      const { user } = await setupScales(3, ['C', 'A', 'B'])
      const ctx = createMockContext({ state: { client: user } })
      const url = new URL('http://localhost:8001/v1/scales?filter[name]=A')
      await ScaleController.list(ctx, url)
      const data = (ctx.response.body as Response)?.data as ScaleResource[]

      expect(ctx.response.status).toBe(200)
      expect(data).toHaveLength(1)
    })

    it('paginates results', async () => {
      const total = 5
      const limit = 3
      const { user } = await setupScales(total)
      const ctx = createMockContext({ state: { client: user } })
      const url = new URL(`http://localhost:8001/v1/scales?limit=${limit}&offset=1`)
      await ScaleController.list(ctx, url)
      const data = (ctx.response.body as Response)?.data as ScaleResource[]

      expect(data).toHaveLength(limit)
      expect(data[0].attributes).toHaveProperty('slug', 'scale-04')
      expect(data[1].attributes).toHaveProperty('slug', 'scale-03')
      expect(data[2].attributes).toHaveProperty('slug', 'scale-02')
    })
  })

  describe('update', () => {
    let ctx: Context
    let scale: Scale
    let patch: ScalePatch
    const attributes = createScaleAttributes()
    const updatedName = 'Updated Scale'
    const updatedLevels = ['X', 'Y', 'Z']

    beforeEach(async () => {
      const { scales } = await setupScales(1)
      scale = scales[0]
      patch = {
        data: {
          type: 'scales',
          id: scale.id ?? 'ERROR',
          attributes: {
            name: updatedName,
            levels: updatedLevels
          }
        }
      }

      ctx = createMockContext({
        state: { scale },
        body: stringToReadableStream(JSON.stringify(patch))
      })
    })

    it('updates the scale', async () => {
      await ScaleController.update(ctx)
      const data = (ctx.response.body as Response)?.data as ScaleResource
      const untouchedFields = ['slug', 'description', 'body', 'notes'] as (keyof ScaleAttributes)[]

      expect(ctx.response.status).toBe(200)
      expect(data).toBeDefined()
      expect(data.type).toBe('scales')
      expect(data.attributes).toHaveProperty('name', updatedName)
      expect(data.attributes?.levels).toEqual(updatedLevels)
      for (const field of untouchedFields) {
        expect((data.attributes as ScaleAttributes)[field]).toBe(scale[field])
      }
    })

    it('adds authors', async () => {
      const { user } = await setupUser({ createAccount: false, createToken: false })
      const patch = {
        data: {
          type: 'scales',
          id: scale.id ?? 'ERROR',
          attributes: {},
          relationships: {
            authors: {
              data: [
                ...scale.authors.map(author => ({ type: 'users', id: author.id ?? 'ERROR' } as UserResource)),
                { type: 'users', id: user.id } as UserResource
              ]
            }
          }
        }
      }

      ctx = createMockContext({
        state: { scale },
        body: stringToReadableStream(JSON.stringify(patch))
      })

      await ScaleController.update(ctx)
      const data = (ctx.response.body as Response)?.data as ScaleResource
      expect(data.relationships?.authors?.data).toHaveLength(2)
    })

    it('removes authors', async () => {
      const patch = {
        data: {
          type: 'scales',
          id: scale.id ?? 'ERROR',
          attributes: {},
          relationships: { authors: { data: [] } }
        }
      }

      ctx = createMockContext({
        state: { scale },
        body: stringToReadableStream(JSON.stringify(patch))
      })

      await ScaleController.update(ctx)
      const data = (ctx.response.body as Response)?.data as ScaleResource
      expect(data.relationships?.authors?.data).toHaveLength(0)
    })

    it('returns a sparse fieldset', async () => {
      const objects = getAllFieldCombinations(attributes)
      for (const object of objects) {
        const fields = Object.keys(object) as (keyof ScaleAttributes)[]
        const url = new URL(`${getRoot()}/scales/${scale.id}?fields[scales]=${fields.join(',')}`)
        await ScaleController.update(ctx, url)
        const data = (ctx.response.body as Response)?.data as ScaleResource
        const receivedAttributes = data.attributes as ScaleAttributes

        expect(ctx.response.status).toBe(200)
        for (const field of fields) {
          expect(receivedAttributes[field] === undefined).toEqual(object[field] === undefined)
        }
      }
    })
  })

  describe('delete', () => {
    it('deletes the scale', async () => {
      const { scales } = await setupScales(1)
      const scale = scales[0]
      const ctx = createMockContext({ state: { scale } })
      await ScaleController.delete(ctx)
      expect(ctx.response.status).toBe(204)
    })
  })
})
