import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createAuthToken } from '../../../types/auth-token.ts'
import authTokenToAuthTokenRecord from './auth-token-record.ts'

describe('authTokenToAuthTokenRecord', () => {
  it('returns an AuthToken', () => {
    const token = createAuthToken()
    const actual = authTokenToAuthTokenRecord(token)

    expect(actual.id).toBe(token.id)
    expect(actual.uid).toBe(token.user.id)
    expect(actual.refresh).toBe(token.refresh)
    expect(actual.token_expiration).toBe(token.expiration.token)
    expect(actual.refresh_expiration).toBe(token.expiration.refresh)
  })
})
