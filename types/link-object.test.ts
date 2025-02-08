import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import getRoot from '../utils/get-root.ts'
import { isLinkObject } from './link-object.ts'

describe('isLinkObject', () => {
  const full = {
    href: getRoot() + '/tests',
    rel: 'test',
    describedBy: getRoot() + '/docs',
    title: 'Test Link',
    type: 'test',
    hreflang: 'en-us'
  }

  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isLinkObject(primitive)).toBe(false)
    }
  })

  it('returns true if given a LinkObject object', () => {
    const objects = getAllFieldCombinations(full)
    for (const object of objects) {
      expect(isLinkObject(object)).toBe(Object.keys(object).includes('href'))
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isLinkObject({ ...full, other: true })).toBe(false)
  })
})
