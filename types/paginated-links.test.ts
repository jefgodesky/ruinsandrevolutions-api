import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import getRoot from '../utils/get-root.ts'
import { isPaginatedLinks } from './paginated-links.ts'

describe('isPaginatedLinks', () => {
  const full = {
    self: getRoot() + '/tests',
    describedBy: { href: getRoot() + '/docs' },
    other: getRoot() + '/tests/other',
    first: getRoot() + '/tests/1',
    prev: getRoot() + '/tests/3',
    next: getRoot() + '/tests/4',
    last: getRoot() + '/tests/8'
  }

  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isPaginatedLinks(primitive)).toBe(false)
    }
  })

  it('returns true if given a PaginatedLinks object', () => {
    const objects = getAllFieldCombinations(full)
    const required = ['self', 'first', 'prev', 'next', 'last']
    for (const object of objects) {
      const hasAllRequired = required.every(key => Object.keys(object).includes(key))
      expect(isPaginatedLinks(object)).toBe(hasAllRequired)
    }
  })

  it('returns false if the object has properties that are neither strings nor LinkObjects', () => {
    expect(isPaginatedLinks({ ...full, other: true })).toBe(false)
  })
})
