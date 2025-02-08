import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import hasAllProperties from '../utils/has-all-properties.ts'
import { createScale, isScale, isScalePartial } from './scale.ts'

describe('isScale', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isScale(primitive)).toBe(false)
    }
  })

  it('returns true if given a Scale object', () => {
    const objects = getAllFieldCombinations(createScale())
    for (const object of objects) {
      expect(isScale(object)).toBe(hasAllProperties(object, ['id', 'name', 'levels', 'authors']))
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isScale({ ...createScale(), other: true })).toBe(false)
  })
})

describe('isScalePartial', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isScalePartial(primitive)).toBe(false)
    }
  })

  it('returns true if given a Scale partial', () => {
    const objects = getAllFieldCombinations(createScale())
    for (const object of objects) {
      expect(isScalePartial(object)).toBe(true)
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isScalePartial({ ...createScale(), other: true })).toBe(false)
  })
})
