import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import hasAllProperties from '../utils/has-all-properties.ts'
import {
  createScaleAttributes,
  isScaleAttributes,
  isScaleAttributesPartial
} from './scale-attributes.ts'

describe('isScaleAttributes', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isScaleAttributes(primitive)).toBe(false)
    }
  })

  it('returns true if given a ScaleAttributes object', () => {
    const objects = getAllFieldCombinations(createScaleAttributes())
    for (const object of objects) {
      expect(isScaleAttributes(object)).toBe(hasAllProperties(object, ['name', 'levels']))
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isScaleAttributes({ ...createScaleAttributes(), other: true })).toBe(false)
  })
})

describe('isScaleAttributesPartial', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isScaleAttributesPartial(primitive)).toBe(false)
    }
  })

  it('returns true if given a ScaleAttributes partial', () => {
    const objects = getAllFieldCombinations(createScaleAttributes())
    for (const object of objects) {
      expect(isScaleAttributesPartial(object)).toBe(true)
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isScaleAttributesPartial({ ...createScaleAttributes(), other: true })).toBe(false)
  })
})
