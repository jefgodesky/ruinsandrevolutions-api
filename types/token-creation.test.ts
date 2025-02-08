import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createTokenCreation, isTokenCreation } from './token-creation.ts'

describe('isTokenCreation', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isTokenCreation(primitive)).toBe(false)
    }
  })

  it('returns false if given an object that is not a TokenCreation', () => {
    expect(isTokenCreation({ a: 1 })).toBe(false)
  })

  it('returns false if given TokenAccessAttributes without an approved provider', () => {
    expect(isTokenCreation({
      data: {
        type: 'tokens',
        attributes: {
          provider: 'ACME Discount OAuth Providers',
          token: 'test-id-token'
        }
      }
    })).toBe(false)
  })

  it('returns true if given an object with TokenAccessAttributes', () => {
    expect(isTokenCreation(createTokenCreation())).toBe(true)
  })

  it('returns true if given an object with TokenRefreshAttributes', () => {
    expect(isTokenCreation({
      data: {
        type: 'tokens',
        attributes: {
          token: 'test-jwt-token'
        }
      }
    })).toBe(true)
  })
})
