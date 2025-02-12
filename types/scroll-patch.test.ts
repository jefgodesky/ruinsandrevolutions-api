import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import { createScrollAttributes } from './scroll-attributes.ts'
import { createUser } from './user.ts'
import {
  createScrollPatch,
  isScrollPatch
} from './scroll-patch.ts'

describe('isScrollPatch', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isScrollPatch(primitive)).toBe(false)
    }
  })

  it('returns true if given a ScrollPatch object', () => {
    const objects = getAllFieldCombinations(createScrollAttributes())
    for (const attributes of objects) {
      expect(isScrollPatch(createScrollPatch(attributes))).toBe(true)
    }
  })

  it('returns true with authors', () => {
    const attributes = createScrollAttributes()
    const authors = [createUser()]
    const post = createScrollPatch(attributes, crypto.randomUUID(), authors)
    expect(isScrollPatch(post)).toBe(true)
  })

  it('returns true with author ID strings', () => {
    const attributes = createScrollAttributes()
    const authors = [crypto.randomUUID()]
    const post = createScrollPatch(attributes, crypto.randomUUID(), authors)
    expect(isScrollPatch(post)).toBe(true)
  })

  it('returns false if the object has additional properties', () => {
    expect(isScrollPatch({ ...createScrollPatch(), other: true })).toBe(false)
  })
})
