import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import getRoot from '../utils/get-root.ts'
import { createUserAttributes } from './user-attributes.ts'
import { isUserResource } from './user-resource.ts'

describe('isUserResource', () => {
  const baseline = {
    type: 'users',
    id: crypto.randomUUID()
  }

  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isUserResource(primitive)).toBe(false)
    }
  })

  it('returns false if type is not users', () => {
    expect(isUserResource({ type: 'other', id: crypto.randomUUID() })).toBe(false)
  })

  it('returns false if object has no ID', () => {
    expect(isUserResource({ type: 'users' })).toBe(false)
  })

  it('returns true if given the most basic possible UserResource object', () => {
    expect(isUserResource(baseline)).toBe(true)
  })

  it('returns false if id is not a string', () => {
    const cases = [() => {}, null, undefined, true, false, 1]
    for (const id of cases) {
      expect(isUserResource({ type: 'users', id })).toBe(false)
    }
  })

  it('returns true if given links', () => {
    const links = { self: getRoot() + '/tests' }
    expect(isUserResource({ links, ...baseline })).toBe(true)
  })

  it('returns true if UserResource includes valid attributes', () => {
    const objects = getAllFieldCombinations(createUserAttributes())
    for (const attributes of objects) {
      expect(isUserResource({ ...baseline, attributes })).toBe(true)
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isUserResource({ ...baseline, other: true })).toBe(false)
  })
})
