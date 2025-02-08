import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getAllFieldCombinations from '../utils/testing/get-all-field-combinations.ts'
import getRoot from '../utils/get-root.ts'
import { createScaleAttributes } from './scale-attributes.ts'
import { isScaleResource } from './scale-resource.ts'

describe('isScaleResource', () => {
  const baseline = {
    type: 'scales',
    id: crypto.randomUUID()
  }

  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isScaleResource(primitive)).toBe(false)
    }
  })

  it('returns false if type is not scales', () => {
    expect(isScaleResource({ type: 'other', id: crypto.randomUUID() })).toBe(false)
  })

  it('returns false if object has no ID', () => {
    expect(isScaleResource({ type: 'scales' })).toBe(false)
  })

  it('returns true if given the most basic possible ScaleResource object', () => {
    expect(isScaleResource(baseline)).toBe(true)
  })

  it('returns false if id is not a string', () => {
    const cases = [() => {}, null, undefined, true, false, 1]
    for (const id of cases) {
      expect(isScaleResource({ type: 'scales', id })).toBe(false)
    }
  })

  it('returns true if given links', () => {
    const links = { self: getRoot() + '/tests' }
    expect(isScaleResource({ links, ...baseline })).toBe(true)
  })

  it('returns true if ScaleResource includes valid attributes', () => {
    const objects = getAllFieldCombinations(createScaleAttributes())
    for (const attributes of objects) {
      expect(isScaleResource({ ...baseline, attributes })).toBe(true)
    }
  })

  it('returns false if the object has additional properties', () => {
    expect(isScaleResource({ ...baseline, other: true })).toBe(false)
  })
})
