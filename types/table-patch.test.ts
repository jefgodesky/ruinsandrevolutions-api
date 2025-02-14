import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import { createTableAttributes } from './table-attributes.ts'
import { createUser } from './user.ts'
import {
  createTablePatch,
  isTablePatch
} from './table-patch.ts'

describe('isTablePatch', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isTablePatch(primitive)).toBe(false)
    }
  })

  it('returns true if given a TablePatch object', () => {
    const objects = getAllFieldCombinations(createTableAttributes())
    for (const attributes of objects) {
      expect(isTablePatch(createTablePatch(attributes))).toBe(true)
    }
  })

  it('returns true with authors', () => {
    const attributes = createTableAttributes()
    const authors = [createUser()]
    const post = createTablePatch(attributes, authors)
    expect(isTablePatch(post)).toBe(true)
  })

  it('returns true with author ID strings', () => {
    const attributes = createTableAttributes()
    const authors = [crypto.randomUUID()]
    const post = createTablePatch(attributes, authors)
    expect(isTablePatch(post)).toBe(true)
  })

  it('returns false if the object has additional properties', () => {
    expect(isTablePatch({ ...createTablePatch(), other: true })).toBe(false)
  })
})
