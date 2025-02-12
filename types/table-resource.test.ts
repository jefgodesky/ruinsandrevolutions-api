import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import getRoot from '../utils/get-root.ts'
import { createTableAttributes } from './table-attributes.ts'
import { isTableResource } from './table-resource.ts'

describe('isTableResource', () => {
  const baseline = {
    type: 'tables',
    id: crypto.randomUUID()
  }

  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isTableResource(primitive)).toBe(false)
    }
  })

  it('returns false if type is not tables', () => {
    expect(isTableResource({ type: 'other', id: crypto.randomUUID() })).toBe(false)
  })

  it('returns false if object has no ID', () => {
    expect(isTableResource({ type: 'tables' })).toBe(false)
  })

  it('returns true if given the most basic possible ScrollResource object', () => {
    expect(isTableResource(baseline)).toBe(true)
  })

  it('returns false if id is not a string', () => {
    const cases = [() => {}, null, undefined, true, false, 1]
    for (const id of cases) {
      expect(isTableResource({ type: 'tables', id })).toBe(false)
    }
  })

  it('returns true if given links', () => {
    const links = { self: getRoot() + '/tests' }
    expect(isTableResource({ links, ...baseline })).toBe(true)
  })

  it('returns true if TableResource includes valid attributes', () => {
    const objects = getAllFieldCombinations(createTableAttributes())
    for (const attributes of objects) {
      expect(isTableResource({ ...baseline, attributes })).toBe(true)
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isTableResource({ ...baseline, other: true })).toBe(false)
  })
})
