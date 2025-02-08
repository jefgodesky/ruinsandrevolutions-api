import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import isObjectArray from './object-array.ts'

describe('isObjectArray', () => {
  it('returns false if not given an array', () => {
    const items = [() => {}, null, undefined, true, 42, 'Hello', {}]
    for (const item of items) {
      expect(isObjectArray(item)).toBe(false)
    }
  })

  it('returns true if given an empty array', () => {
    expect(isObjectArray([])).toBe(true)
  })

  it('returns true if given an array of objects', () => {
    expect(isObjectArray([{}, { a: 1 }])).toBe(true)
  })

  it('returns false if array contains elements other than objects', () => {
    expect(isObjectArray([{}, { a: 1 }, true])).toBe(false)
  })
})
