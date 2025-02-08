import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import isNumberOrUndefined from './number.ts'

describe('isNumberOrUndefined', () => {
  it('returns true if given a number', () => {
    expect(isNumberOrUndefined(42)).toBe(true)
  })

  it('returns true if given undefined', () => {
    expect(isNumberOrUndefined(undefined)).toBe(true)
  })

  it('returns false if given anything else', () => {
    const vals = ['Hello, world!', true, null, () => {}, {}, []]
    expect(vals.some(v => isNumberOrUndefined(v))).toBe(false)
  })
})
