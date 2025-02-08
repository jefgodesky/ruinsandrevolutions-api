import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from './testing/get-all-field-combinations.ts'
import hasNoOtherProperties from './has-no-other-properties.ts'

describe('hasNoOtherProperties', () => {
  const full = { a: 1, b: 2, c: 3 }
  const permitted = ['a', 'b', 'c']

  it('returns true if the object has only the listed properties', () => {
    const objects = getAllFieldCombinations(full)
    for (const object of objects) {
      expect(hasNoOtherProperties(object, permitted)).toBe(true)
    }
  })

  it('returns false if the object has any other properties', () => {
    expect(hasNoOtherProperties({ ...full, d: 4 }, permitted)).toBe(false)
  })
})
