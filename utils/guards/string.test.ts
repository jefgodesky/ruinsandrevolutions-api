import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import isStringOrUndefined from './string.ts'

describe('isStringOrUndefined', () => {
  it('returns true if given a string', () => {
    expect(isStringOrUndefined('Hello, world!')).toBe(true)
  })

  it('returns true if given undefined', () => {
    expect(isStringOrUndefined(undefined)).toBe(true)
  })

  it('returns false if given anything else', () => {
    const vals = [42, true, null, () => {}, {}, []]
    expect(vals.some(v => isStringOrUndefined(v))).toBe(false)
  })
})
