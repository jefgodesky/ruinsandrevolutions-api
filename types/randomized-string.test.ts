import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { isRandomizedString } from './randomized-string.ts'

describe('isRandomizedString', () => {
  const human = '2d6 + Intelligence'
  const computable = `{{${human}}}`

  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isRandomizedString(primitive)).toBe(false)
    }
  })

  it('returns true if given an object with a human-readable string', () => {
    expect(isRandomizedString({ human })).toBe(true)
  })

  it('returns true if given an object with human- and computer-readable strings', () => {
    expect(isRandomizedString({ human, computable })).toBe(true)
  })

  it('returns false if only given an object with a computable string', () => {
    expect(isRandomizedString({ computable })).toBe(false)
  })

  it('returns false if given an object with any other properties', () => {
    expect(isRandomizedString({ human, computable, other: true })).toBe(false)
  })
})
