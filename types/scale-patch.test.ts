import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import { createScaleAttributes } from './scale-attributes.ts'
import {
  createScalePatch,
  isScalePatch
} from './scale-patch.ts'

describe('isScalePatch', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isScalePatch(primitive)).toBe(false)
    }
  })

  it('returns true if given a ScalePatch object', () => {
    const objects = getAllFieldCombinations(createScaleAttributes())
    for (const attributes of objects) {
      expect(isScalePatch(createScalePatch(attributes))).toBe(true)
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isScalePatch({ ...createScalePatch(), other: true })).toBe(false)
  })
})
