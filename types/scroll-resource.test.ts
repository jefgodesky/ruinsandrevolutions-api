import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import getRoot from '../utils/get-root.ts'
import { createScrollAttributes } from './scroll-attributes.ts'
import { isScrollResource } from './scroll-resource.ts'

describe('isScrollResource', () => {
  const baseline = {
    type: 'scrolls',
    id: crypto.randomUUID()
  }

  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isScrollResource(primitive)).toBe(false)
    }
  })

  it('returns false if type is not scrolls', () => {
    expect(isScrollResource({ type: 'other', id: crypto.randomUUID() })).toBe(false)
  })

  it('returns false if object has no ID', () => {
    expect(isScrollResource({ type: 'scrolls' })).toBe(false)
  })

  it('returns true if given the most basic possible ScrollResource object', () => {
    expect(isScrollResource(baseline)).toBe(true)
  })

  it('returns false if id is not a string', () => {
    const cases = [() => {}, null, undefined, true, false, 1]
    for (const id of cases) {
      expect(isScrollResource({ type: 'scrolls', id })).toBe(false)
    }
  })

  it('returns true if given links', () => {
    const links = { self: getRoot() + '/tests' }
    expect(isScrollResource({ links, ...baseline })).toBe(true)
  })

  it('returns true if ScrollResource includes valid attributes', () => {
    const objects = getAllFieldCombinations(createScrollAttributes())
    for (const attributes of objects) {
      expect(isScrollResource({ ...baseline, attributes })).toBe(true)
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isScrollResource({ ...baseline, other: true })).toBe(false)
  })
})
