import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import isObject from './object.ts'

describe('isObject', () => {
  it('returns true if given an object', () => {
    expect(isObject({})).toBe(true)
  })

  it('returns false if given anything else', () => {
    const vals = [42, 'Hello, world!', true, null, () => {}, []]
    expect(vals.some(v => isObject(v))).toBe(false)
  })
})
