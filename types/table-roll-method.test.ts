import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import {
  isTableRollMethod,
  isTableRollMethodDict,
  createTableRollMethod
} from './table-roll-method.ts'

describe('isTableRollMethod', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isTableRollMethod(primitive)).toBe(false)
    }
  })

  it('returns true if given a TableRollMethod object', () => {
    expect(isTableRollMethod(createTableRollMethod())).toBe(true)
  })

  it('returns false if the object has additional properties', () => {
    expect(isTableRollMethod({ ...createTableRollMethod(), other: true })).toBe(false)
  })
})

describe('isTableRollMethodDicr', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isTableRollMethodDict(primitive)).toBe(false)
    }
  })

  it('returns true if given a dictionary of TableRollMethod> objects', () => {
    expect(isTableRollMethodDict({ a: createTableRollMethod() })).toBe(true)
  })

  it('returns false if the object contains properties of other types', () => {
    expect(isTableRollMethodDict({ a: createTableRollMethod(), b: { pass: true } })).toBe(false)
  })
})
