import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { isAuthTokenResource } from './auth-token-resource.ts'

describe('isAuthTokenResource', () => {
  const baseline = {
    type: 'token',
    attributes: {
      token: 'x',
      expiration: 'y'
    }
  }

  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isAuthTokenResource(primitive)).toBe(false)
    }
  })

  it('returns false if type is not token', () => {
    expect(isAuthTokenResource({ type: 'other', attributes: baseline.attributes })).toBe(false)
  })

  it('returns false if object is missing attributes', () => {
    expect(isAuthTokenResource({ type: 'token' })).toBe(false)
    expect(isAuthTokenResource({ type: 'token', attributes: {} })).toBe(false)
    expect(isAuthTokenResource({ type: 'token', attributes: { token: 'x' } })).toBe(false)
    expect(isAuthTokenResource({ type: 'token', attributes: { expiration: 'y' } })).toBe(false)

  })

  it('returns true if given an auth token resource', () => {
    expect(isAuthTokenResource(baseline)).toBe(true)
  })

  it('returns false if the object has additional properties', () => {
    expect(isAuthTokenResource({ ...baseline, other: true })).toBe(false)
  })
})
