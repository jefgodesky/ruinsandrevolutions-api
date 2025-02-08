import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import isDateArray from './date-array.ts'

describe('isDateArray', () => {
  it('returns false if not given an array', () => {
    const items = [() => {}, null, undefined, true, 42, 'Hello', {}]
    for (const item of items) {
      expect(isDateArray(item)).toBe(false)
    }
  })

  it('returns true if given an empty array', () => {
    expect(isDateArray([])).toBe(true)
  })

  it('returns true if given an array of Dates', () => {
    expect(isDateArray([new Date()])).toBe(true)
  })

  it('returns false if array contains elements other than Dates', () => {
    expect(isDateArray([new Date(), 42])).toBe(false)
  })
})
