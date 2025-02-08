import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import isDateOrUndefined from './date.ts'

describe('isDateOrUndefined', () => {
  it('returns true if given a date', () => {
    expect(isDateOrUndefined(new Date())).toBe(true)
  })

  it('returns true if given undefined', () => {
    expect(isDateOrUndefined(undefined)).toBe(true)
  })

  it('returns false if given anything else', () => {
    const vals = [42, 'Hello, world!', true, null, () => {}, {}, []]
    expect(vals.some(v => isDateOrUndefined(v))).toBe(false)
  })

  it('returns false if given an invalid date', () => {
    expect(isDateOrUndefined(new Date('nope'))).toBe(false)
  })
})
