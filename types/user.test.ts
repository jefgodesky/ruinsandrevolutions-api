import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import { isUser, createUser } from './user.ts'

describe('isUser', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 'test', 1]
    for (const primitive of primitives) {
      expect(isUser(primitive)).toBe(false)
    }
  })

  it('returns false if given an empty object', () => {
    expect(isUser({})).toBe(false)
  })

  it('returns true if given a valid User', () => {
    const required = ['name']
    const objects = getAllFieldCombinations(createUser())
    for (const object of objects) {
      const includesAllRequired = required.every(key => Object.keys(object).includes(key))
      expect(isUser(object)).toBe(includesAllRequired)
    }
  })

  it('returns false if given additional properties', () => {
    expect(isUser({ ...createUser(), other: 'nope' })).toBe(false)
  })
})
