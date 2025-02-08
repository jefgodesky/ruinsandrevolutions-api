import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createUser } from '../../../types/user.ts'
import userToAuthTokenRecord from './auth-token-record.ts'

describe('userToAuthTokenRecord', () => {
  it('creates an AuthTokenRecord', () => {
    const user = createUser()
    const actual = userToAuthTokenRecord(user)
    expect(actual.uid).toBe(user.id)
    expect(actual.refresh).toBeDefined()
    expect(actual.token_expiration).toBeInstanceOf(Date)
    expect(actual.refresh_expiration).toBeInstanceOf(Date)
  })
})
