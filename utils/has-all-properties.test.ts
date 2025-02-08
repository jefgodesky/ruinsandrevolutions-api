import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from './testing/get-all-field-combinations.ts'
import hasAllProperties from './has-all-properties.ts'

describe('hasAllProperties', () => {
  const full = { a: 1, b: 2, c: 3 }
  const required = ['a', 'b', 'c']

  it('returns true if the object has all the listed properties', () => {
    expect(hasAllProperties(full, required)).toBe(true)
  })

  it('returns false if the object lacks any listed properties', () => {
    const objects = getAllFieldCombinations(full)
    for (const object of objects) {
      const hasAll = required.every(key => Object.keys(object).includes(key))
      expect(hasAllProperties(object, required)).toBe(hasAll)
    }
  })
})
