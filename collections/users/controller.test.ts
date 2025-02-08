import { describe, beforeEach, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import { createMockContext } from '@oak/oak/testing'
import type Response from '../../types/response.ts'
import type UserResource from '../../types/user-resource.ts'
import DB from '../../DB.ts'
import { createUser } from '../../types/user.ts'
import { createUserAttributes, UserAttributesKeys } from '../../types/user-attributes.ts'
import getAllFieldCombinations from '../../utils/testing/get-all-field-combinations.ts'
import getRoot from '../../utils/get-root.ts'
import setupUser from '../../utils/testing/setup-user.ts'
import stringToReadableStream from '../../utils/transformers/string-to/readable-stream.ts'
import expectUsersAccountsTokens from '../../utils/testing/expect-users-accounts-tokens.ts'
import UserController from './controller.ts'

describe('UserController', () => {
  let attributes = createUserAttributes()
  let user = createUser({ ...attributes })

  afterEach(DB.clear)
  afterAll(DB.close)

  describe('get', () => {
    const ctx = createMockContext({ state: { user } })

    it('returns the user', () => {
      UserController.get(ctx)
      const data = (ctx.response.body as Response)?.data as UserResource
      expect(ctx.response.status).toBe(200)
      expect(data).toBeDefined()
      expect(data.type).toBe('users')
      expect(data.attributes).toHaveProperty('name', name)
    })

    it('returns a sparse fieldset', () => {
      const objects = getAllFieldCombinations(attributes)
      for (const object of objects) {
        const fields = Object.keys(object) as UserAttributesKeys[]
        const url = new URL(`${getRoot()}/users/${user.id}?fields[users]=${fields.join(',')}`)
        UserController.get(ctx, url)
        const data = (ctx.response.body as Response)?.data as UserResource

        expect(ctx.response.status).toBe(200)
        expect(data.attributes?.name).toBe(object.name)
        expect(data.attributes?.username).toBe(object.username)
      }
    })
  })

  describe('patch', () => {
    beforeEach(async () => {
      ({ user } = await setupUser())
    })

    it('updates the fields provided', async () => {
      const name = 'Jonathan Dauex'
      const update = {
        data: {
          type: 'users',
          id: user.id,
          attributes: { name }
        }
      }

      const body = stringToReadableStream(JSON.stringify(update))
      const ctx = createMockContext({ body, state: { user } })
      await UserController.patch(ctx)
      const data = (ctx.response.body as Response)?.data as UserResource

      expect(ctx.response.status).toBe(200)
      expect(data.attributes?.name).toBe(name)
      expect(data.attributes?.username).toBe(user.username)
      expect(data.id).toBe(user.id)
    })

    it('returns a sparse fieldset', async () => {
      const objects = getAllFieldCombinations(attributes)
      for (const object of objects) {
        const update = {
          data: {
            type: 'users',
            id: user.id,
            attributes: {
              name: attributes.name,
              username: attributes.username
            }
          }
        }

        const body = stringToReadableStream(JSON.stringify(update))
        const ctx = createMockContext({ body, state: { user } })
        const fields = Object.keys(object) as UserAttributesKeys[]
        const url = new URL(`${getRoot()}/users/${user.id}?fields[users]=${fields.join(',')}`)
        await UserController.patch(ctx, url)
        const data = (ctx.response.body as Response)?.data as UserResource

        expect(ctx.response.status).toBe(200)
        expect(data.attributes?.name).toBe(object.name)
        expect(data.attributes?.username).toBe(object.username)
      }
    })
  })

  describe('destroy', () => {
    it('deletes the user', async () => {
      const { user } = await setupUser()
      const ctx = createMockContext({ state: { user } })
      await UserController.destroy(ctx)

      expect(ctx.response.status).toBe(204)
      await expectUsersAccountsTokens({ users: 0, accounts: 0, tokens: 0 })
    })
  })
})
