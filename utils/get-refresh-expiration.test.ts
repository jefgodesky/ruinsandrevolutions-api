import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getRefreshExpiration from './get-refresh-expiration.ts'

describe('getRefreshExpiration', () => {
  it('returns the refresh expiration date', () => {
    const expected = Date.now() + (7 * 24 * 60 * 60 * 1000)
    const actual = getRefreshExpiration()
    expect(actual).toBeInstanceOf(Date)
    expect(actual).toBeGreaterThan(expected - 1000)
    expect(actual).toBeLessThan(expected + 1000)
  })
})
