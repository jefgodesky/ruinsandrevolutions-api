import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import isBooleanArray from './boolean-array.ts'

describe('isBooleanArray', () => {
  it('returns false if not given an array', () => {
    const items = [() => {}, null, undefined, true, 42, 'Hello', {}]
    for (const item of items) {
      expect(isBooleanArray(item)).toBe(false)
    }
  })

  it('returns true if given an empty array', () => {
    expect(isBooleanArray([])).toBe(true)
  })

  it('returns true if given an array of booleans', () => {
    expect(isBooleanArray([true, false])).toBe(true)
  })

  it('returns false if array contains elements other than booleans', () => {
    expect(isBooleanArray([true, false, 42])).toBe(false)
  })
})
