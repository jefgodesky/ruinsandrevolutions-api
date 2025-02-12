import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import hasAllProperties from '../utils/has-all-properties.ts'
import {
  createScrollAttributes,
  isScrollAttributes,
  isScrollAttributesPartial
} from './scroll-attributes.ts'

describe('isScrollAttributes', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isScrollAttributes(primitive)).toBe(false)
    }
  })

  it('returns true if given a ScrollAttributes object', () => {
    const objects = getAllFieldCombinations(createScrollAttributes())
    for (const object of objects) {
      expect(isScrollAttributes(object)).toBe(hasAllProperties(object, ['name', 'start']))
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isScrollAttributes({ ...createScrollAttributes(), other: true })).toBe(false)
  })
})

describe('isScrollAttributesPartial', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isScrollAttributesPartial(primitive)).toBe(false)
    }
  })

  it('returns true if given a ScrollAttributes partial', () => {
    const objects = getAllFieldCombinations(createScrollAttributes())
    for (const object of objects) {
      expect(isScrollAttributesPartial(object)).toBe(true)
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isScrollAttributesPartial({ ...createScrollAttributes(), other: true })).toBe(false)
  })
})
