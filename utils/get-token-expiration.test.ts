import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getTokenExpiration from './get-token-expiration.ts'

describe('getTokenExpiration', () => {
  it('returns the token expiration date', () => {
    const expected = Date.now() + (10 * 60 * 1000)
    const actual = getTokenExpiration()
    expect(actual).toBeInstanceOf(Date)
    expect(actual).toBeGreaterThan(expected - 1000)
    expect(actual).toBeLessThan(expected + 1000)
  })
})
