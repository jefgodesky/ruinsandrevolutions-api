import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { isAuthTokenAttributes } from './auth-token-attributes.ts'

describe('isAuthTokenAttributes', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isAuthTokenAttributes(primitive)).toBe(false)
    }
  })

  it('returns true if given an auth token attributes object', () => {
    expect(isAuthTokenAttributes({ token: 'x', expiration: 'y' })).toBe(true)
  })

  it('returns false if either property is not a string', () => {
    expect(isAuthTokenAttributes({ token: 'x', expiration: 2 })).toBe(false)
    expect(isAuthTokenAttributes({ token: 1, expiration: 'y' })).toBe(false)
  })

  it('returns false if the object has additional properties', () => {
    expect(isAuthTokenAttributes({ token: 'x', expiration: 'y', other: true })).toBe(false)
  })
})
