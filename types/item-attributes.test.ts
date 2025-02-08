import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import hasAllProperties from '../utils/has-all-properties.ts'
import {
  createItemAttributes,
  isItemAttributes,
  isItemAttributesPartial
} from './item-attributes.ts'

describe('isItemAttributes', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isItemAttributes(primitive)).toBe(false)
    }
  })

  it('returns true if given an ItemAttributes object', () => {
    const objects = getAllFieldCombinations(createItemAttributes())
    for (const object of objects) {
      expect(isItemAttributes(object)).toBe(hasAllProperties(object, ['name']))
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isItemAttributes({ ...createItemAttributes(), other: true })).toBe(false)
  })

  it('returns true if additional properties are expected', () => {
    expect(isItemAttributes({ ...createItemAttributes(), other: true }, ['other'])).toBe(true)
  })
})

describe('isItemAttributesPartial', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isItemAttributesPartial(primitive)).toBe(false)
    }
  })

  it('returns true if given an ItemAttributes partial', () => {
    const objects = getAllFieldCombinations(createItemAttributes())
    for (const object of objects) {
      expect(isItemAttributesPartial(object)).toBe(true)
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isItemAttributesPartial({ ...createItemAttributes(), other: true })).toBe(false)
  })

  it('returns true if additional properties are expected', () => {
    expect(isItemAttributesPartial({ ...createItemAttributes(), other: true }, ['other'])).toBe(true)
  })
})
