import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import { createScrollAttributes, isScrollAttributes } from './scroll-attributes.ts'
import { createUser } from './user.ts'
import {
  createScrollCreation,
  isScrollCreation
} from './scroll-creation.ts'

describe('isScrollCreation', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isScrollCreation(primitive)).toBe(false)
    }
  })

  it('returns true if given a ScrollCreation object', () => {
    const objects = getAllFieldCombinations(createScrollAttributes())
    for (const attributes of objects) {
      if (isScrollAttributes(attributes)) {
        const post = createScrollCreation(attributes)
        expect(isScrollCreation(post)).toBe(true)
      }
    }
  })

  it('returns true with authors', () => {
    const attributes = createScrollAttributes()
    const authors = [createUser()]
    const post = createScrollCreation(attributes, authors)
    expect(isScrollCreation(post)).toBe(true)
  })

  it('returns true with author ID strings', () => {
    const attributes = createScrollAttributes()
    const authors = [crypto.randomUUID()]
    const post = createScrollCreation(attributes, authors)
    expect(isScrollCreation(post)).toBe(true)
  })

  it('returns false if the object has additional properties', () => {
    expect(isScrollCreation({ ...createScrollCreation(), other: true })).toBe(false)
  })
})
