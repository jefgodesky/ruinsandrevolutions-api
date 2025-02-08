import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import isStringArray from './string-array.ts'

describe('isStringArray', () => {
  it('returns false if not given an array', () => {
    const items = [() => {}, null, undefined, true, 42, 'Hello', {}]
    for (const item of items) {
      expect(isStringArray(item)).toBe(false)
    }
  })

  it('returns true if given an empty array', () => {
    expect(isStringArray([])).toBe(true)
  })

  it('returns true if given an array of strings', () => {
    expect(isStringArray(['Hello', 'world'])).toBe(true)
  })

  it('returns false if array contains elements other than strings', () => {
    expect(isStringArray(['Hello', 'world', 42])).toBe(false)
  })
})
