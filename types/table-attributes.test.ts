import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import hasAllProperties from '../utils/has-all-properties.ts'
import {
  createTableAttributes,
  isTableAttributes,
  isTableAttributesPartial
} from './table-attributes.ts'

describe('isTableAttributes', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isTableAttributes(primitive)).toBe(false)
    }
  })

  it('returns true if given a TableAttributes object', () => {
    const objects = getAllFieldCombinations(createTableAttributes())
    for (const object of objects) {
      expect(isTableAttributes(object)).toBe(hasAllProperties(object, ['name', 'methods', 'rows']))
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isTableAttributes({ ...createTableAttributes(), other: true })).toBe(false)
  })
})

describe('isTableAttributesPartial', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isTableAttributesPartial(primitive)).toBe(false)
    }
  })

  it('returns true if given a TableAttributes partial', () => {
    const objects = getAllFieldCombinations(createTableAttributes())
    for (const object of objects) {
      expect(isTableAttributesPartial(object)).toBe(true)
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isTableAttributesPartial({ ...createTableAttributes(), other: true })).toBe(false)
  })
})
