import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import { createTableAttributes, isTableAttributes } from './table-attributes.ts'
import { createUser } from './user.ts'
import {
  createTableCreation,
  isTableCreation
} from './table-creation.ts'

describe('isTableCreation', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isTableCreation(primitive)).toBe(false)
    }
  })

  it('returns true if given a TableCreation object', () => {
    const objects = getAllFieldCombinations(createTableAttributes())
    for (const attributes of objects) {
      if (isTableAttributes(attributes)) {
        const post = createTableCreation(attributes)
        expect(isTableCreation(post)).toBe(true)
      }
    }
  })

  it('returns true with authors', () => {
    const attributes = createTableAttributes()
    const authors = [createUser()]
    const post = createTableCreation(attributes, authors)
    expect(isTableCreation(post)).toBe(true)
  })

  it('returns true with author ID strings', () => {
    const attributes = createTableAttributes()
    const authors = [crypto.randomUUID()]
    const post = createTableCreation(attributes, authors)
    expect(isTableCreation(post)).toBe(true)
  })

  it('returns false if the object has additional properties', () => {
    expect(isTableCreation({ ...createTableCreation(), other: true })).toBe(false)
  })
})
