import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import { createUserAttributes, isUserAttributes } from './user-attributes.ts'

describe('isUserAttributes', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isUserAttributes(primitive)).toBe(false)
    }
  })

  it('returns true if given a UserAttributes object', () => {
    const objects = getAllFieldCombinations(createUserAttributes())
    for (const object of objects) {
      expect(isUserAttributes(object)).toBe(true)
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isUserAttributes({ ...createUserAttributes(), other: true })).toBe(false)
  })
})
