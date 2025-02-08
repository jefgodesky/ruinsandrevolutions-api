import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import getRoot from '../utils/get-root.ts'
import { isLinks } from './links.ts'

describe('isLinks', () => {
  const full = {
    self: getRoot() + '/tests',
    describedBy: { href: getRoot() + '/docs' },
    other: getRoot() + '/tests/other'
  }

  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isLinks(primitive)).toBe(false)
    }
  })

  it('returns true if given a Links object', () => {
    const objects = getAllFieldCombinations(full)
    for (const object of objects) {
      expect(isLinks(object)).toBe(Object.keys(object).includes('self'))
    }
  })

  it('returns false if the object has properties that are neither strings nor LinkObjects', () => {
    expect(isLinks({ ...full, other: true })).toBe(false)
  })
})
