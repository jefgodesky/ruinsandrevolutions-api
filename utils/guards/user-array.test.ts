import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createUser } from '../../types/user.ts'
import isUserArray from './user-array.ts'

describe('isUserArray', () => {
  it('returns false if not given an array', () => {
    const items = [() => {}, null, undefined, true, 42, 'Hello', {}]
    for (const item of items) {
      expect(isUserArray(item)).toBe(false)
    }
  })

  it('returns true if given an empty array', () => {
    expect(isUserArray([])).toBe(true)
  })

  it('returns true if given an array of users', () => {
    expect(isUserArray([createUser()])).toBe(true)
  })

  it('returns false if array contains elements other than strings', () => {
    expect(isUserArray([createUser(), 42])).toBe(false)
  })
})
