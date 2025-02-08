import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { PROVIDERS } from './provider.ts'
import { isProviderResource } from './provider-resource.ts'

describe('isUserResource', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isProviderResource(primitive)).toBe(false)
    }
  })

  it('returns false if type is not provider', () => {
    expect(isProviderResource({ type: 'other', id: PROVIDERS.GOOGLE })).toBe(false)
  })

  it('returns false if object has no ID', () => {
    expect(isProviderResource({ type: 'provider' })).toBe(false)
  })

  it('returns true if given a provider resource', () => {
    for (const id of Object.values(PROVIDERS)) {
      expect(isProviderResource({ type: 'provider', id })).toBe(true)
    }
  })

  it('returns false if not given a provider ID', () => {
    const notIDs = [() => {}, null, undefined, true, false, 1, 'true']
    for (const id of notIDs) {
      expect(isProviderResource({ type: 'provider', id })).toBe(false)
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isProviderResource({ type: 'provider', id: PROVIDERS.GOOGLE, other: true })).toBe(false)
  })
})
