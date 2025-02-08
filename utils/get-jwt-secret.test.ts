import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getJWTSecret from './get-jwt-secret.ts'

describe('getJWTSecret', () => {
  it('returns the JWT secret', () => {
    const secret = Deno.env.get('JWT_SECRET')!
    expect(getJWTSecret()).toBe(secret)
  })
})
