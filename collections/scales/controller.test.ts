import { describe, beforeEach, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import { createMockContext } from '@oak/oak/testing'
import type Response from '../../types/response.ts'
import type ScaleAttributes from '../../types/scale-attributes.ts'
import type ScaleResource from '../../types/scale-resource.ts'
import type User from '../../types/user.ts'
import DB from '../../DB.ts'
import { createScaleCreation } from '../../types/scale-creation.ts'
import setupUser from '../../utils/testing/setup-user.ts'
import stringToReadableStream from '../../utils/transformers/string-to/readable-stream.ts'
import ScaleController from './controller.ts'
import UserResource from '../../types/user-resource.ts'

describe('ScaleController', () => {
  let user: User

  beforeEach(async () => {
    ({ user } = await setupUser({ createToken: false, createAccount: false }))
  })

  afterEach(DB.clear)
  afterAll(DB.close)

  describe('create', () => {
    it('creates a scale', async () => {
      const post = createScaleCreation(undefined, [user])
      const ctx = createMockContext({
        state: { client: user },
        body: stringToReadableStream(JSON.stringify(post))
      })
      await ScaleController.create(ctx)

      const data = (ctx.response.body as Response)?.data as ScaleResource
      const attributes = data.attributes as ScaleAttributes
      const copiedFields: Array<keyof ScaleAttributes> = ['name', 'slug', 'description', 'body', 'attribution']

      expect(ctx.response.status).toBe(200)
      expect(data.relationships?.authors?.data).toHaveLength(1)
      expect((data.relationships?.authors?.data as UserResource[])[0].id).toBe(user.id)
      for (const field of copiedFields) {
        expect(attributes[field]).toBe(post.data.attributes[field])
      }
    })
  })
})
