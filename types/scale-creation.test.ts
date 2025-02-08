import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import { createScaleAttributes, isScaleAttributes } from './scale-attributes.ts'
import { createUser } from './user.ts'
import {
  createScaleCreation,
  isScaleCreation
} from './scale-creation.ts'

describe('isScaleCreation', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isScaleCreation(primitive)).toBe(false)
    }
  })

  it('returns true if given a ScaleCreation object', () => {
    const objects = getAllFieldCombinations(createScaleAttributes())
    for (const attributes of objects) {
      if (isScaleAttributes(attributes)) {
        const post = createScaleCreation(attributes)
        expect(isScaleCreation(post)).toBe(true)
      }
    }
  })

  it('returns true with authors', () => {
    const attributes = createScaleAttributes()
    const authors = [createUser()]
    const post = createScaleCreation(attributes, authors)
    expect(isScaleCreation(post)).toBe(true)
  })

  it('returns true with author ID strings', () => {
    const attributes = createScaleAttributes()
    const authors = [crypto.randomUUID()]
    const post = createScaleCreation(attributes, authors)
    expect(isScaleCreation(post)).toBe(true)
  })

  it('returns false if the object has additional properties', () => {
    expect(isScaleCreation({ ...createScaleCreation(), other: true })).toBe(false)
  })
})
