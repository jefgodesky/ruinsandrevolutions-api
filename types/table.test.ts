import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import hasAllProperties from '../utils/has-all-properties.ts'
import { createTable, isTable, isTablePartial } from './table.ts'

describe('isTable', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isTable(primitive)).toBe(false)
    }
  })

  it('returns true if given a Table object', () => {
    const objects = getAllFieldCombinations(createTable())
    for (const object of objects) {
      expect(isTable(object)).toBe(hasAllProperties(object, ['id', 'name', 'rolls', 'rows', 'authors']))
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isTable({ ...createTable(), other: true })).toBe(false)
  })
})

describe('isTablePartial', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isTablePartial(primitive)).toBe(false)
    }
  })

  it('returns true if given a Table partial', () => {
    const objects = getAllFieldCombinations(createTable())
    for (const object of objects) {
      expect(isTablePartial(object)).toBe(true)
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isTablePartial({ ...createTable(), other: true })).toBe(false)
  })
})
