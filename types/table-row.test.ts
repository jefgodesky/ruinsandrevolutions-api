import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createTableRow, isTableRow, areTableRows } from './table-row.ts'

describe('isTableRow', () => {
  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isTableRow(primitive)).toBe(false)
    }
  })

  it('returns true if given a table row', () => {
    const { min, max, result } = createTableRow()
    expect(isTableRow({ result })).toBe(true)
    expect(isTableRow({ min, result })).toBe(true)
    expect(isTableRow({ max, result })).toBe(true)
    expect(isTableRow({ min, max, result })).toBe(true)
  })

  it('returns false if the object has additional properties', () => {
    expect(isTableRow({ ...createTableRow(), other: true })).toBe(false)
  })
})

describe('areTableRows', () => {
  it('returns false if given anything other than an array', () => {
    const notArrays = [() => {}, null, undefined, true, false, 1, 'true', {}, createTableRow()]
    for (const notArray of notArrays) {
      expect(areTableRows(notArray)).toBe(false)
    }
  })

  it('returns true if given an empty array', () => {
    expect(areTableRows([])).toBe(true)
  })

  it('returns true if given an array of table rows', () => {
    expect(areTableRows([createTableRow()])).toBe(true)
  })

  it('returns false if the array contains other elements', () => {
    const notTableRows = [() => {}, null, undefined, true, false, 1, 'true', { a: 1 }]
    for (const elem of notTableRows) {
      expect(areTableRows([createTableRow(), elem])).toBe(false)
    }
  })
})
