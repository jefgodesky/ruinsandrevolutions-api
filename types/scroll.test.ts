import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import hasAllProperties from '../utils/has-all-properties.ts'
import { createScroll, isScroll, isScrollPartial } from './scroll.ts'

describe('isScroll', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isScroll(primitive)).toBe(false)
    }
  })

  it('returns true if given a Scroll object', () => {
    const objects = getAllFieldCombinations(createScroll())
    for (const object of objects) {
      expect(isScroll(object)).toBe(hasAllProperties(object, ['id', 'name', 'start', 'authors']))
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isScroll({ ...createScroll(), other: true })).toBe(false)
  })
})

describe('isScrollPartial', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isScrollPartial(primitive)).toBe(false)
    }
  })

  it('returns true if given a Scroll partial', () => {
    const objects = getAllFieldCombinations(createScroll())
    for (const object of objects) {
      expect(isScrollPartial(object)).toBe(true)
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isScrollPartial({ ...createScroll(), other: true })).toBe(false)
  })
})
