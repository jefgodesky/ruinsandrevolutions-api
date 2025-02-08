import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import isBooleanOrUndefined from './boolean.ts'

describe('isBooleanOrUndefined', () => {
  it('returns true if given a boolean', () => {
    expect(isBooleanOrUndefined(true)).toBe(true)
    expect(isBooleanOrUndefined(false)).toBe(true)
  })

  it('returns true if given undefined', () => {
    expect(isBooleanOrUndefined(undefined)).toBe(true)
  })

  it('returns false if given anything else', () => {
    const vals = [42, 'Hello, world!', null, () => {}, {}, []]
    expect(vals.some(v => isBooleanOrUndefined(v))).toBe(false)
  })
})
