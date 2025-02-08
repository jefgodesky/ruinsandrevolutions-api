import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import isNumberArray from './number-array.ts'

describe('isNumberArray', () => {
  it('returns false if not given an array', () => {
    const items = [() => {}, null, undefined, true, 42, 'Hello', {}]
    for (const item of items) {
      expect(isNumberArray(item)).toBe(false)
    }
  })

  it('returns true if given an empty array', () => {
    expect(isNumberArray([])).toBe(true)
  })

  it('returns true if given an array of numbers', () => {
    expect(isNumberArray([1, 0.5, 0.75])).toBe(true)
  })

  it('returns false if array contains elements other than numbers', () => {
    expect(isNumberArray([1, 2, 'three'])).toBe(false)
  })
})
