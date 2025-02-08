import { describe, afterAll, beforeEach, afterEach, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type AuthTokenResource from '../../../types/auth-token-resource.ts'
import type AuthToken from '../../../types/auth-token.ts'
import DB from '../../../DB.ts'
import getRoot from '../../get-root.ts'
import setupUser from '../../testing/setup-user.ts'
import authTokenToResponse from './response.ts'

describe('authTokenToResponse', () => {
  let token: AuthToken | undefined

  beforeEach(async () => {
    ({ token } = await setupUser())
  })

  afterEach(DB.clear)
  afterAll(DB.close)

  it('generates a Response', async () => {
    const actual = await authTokenToResponse(token!)
    const data = actual.data as AuthTokenResource

    const expectedData: AuthTokenResource = {
      type: 'token',
      id: token?.id ?? '',
      attributes: {
        token: data.attributes.token,
        expiration: token!.expiration.token.toString()
      }
    }

    const expected = {
      jsonapi: { version: '1.1' },
      links: {
        self: `${getRoot()}/auth/token`,
        describedBy: `${getRoot()}/docs`
      },
      data: expectedData
    }
    expect(actual).toEqual(expected)
  })
})
