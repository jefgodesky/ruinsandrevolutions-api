import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createFields } from '../../../types/fields.ts'
import { createTable } from '../../../types/table.ts'
import TableAttributes, { type TableAttributesKeys, tableAttributes, createTableAttributes } from '../../../types/table-attributes.ts'
import getAllFieldCombinations from '../../testing/get-all-field-combinations.ts'
import tableToTableAttributes from './table-attributes.ts'

describe('tableToTableAttributes', () => {
  const attributes = createTableAttributes()
  const table = createTable({ ...attributes })
  const all = tableAttributes.map(field => field as keyof TableAttributes)

  it('returns a TableAttributes partial', () => {
    const actual = tableToTableAttributes(table)
    for (const field of all) {
      expect(actual[field]).toEqual(table[field])
    }
  })

  it('can return a sparse fieldset', () => {
    const objects = getAllFieldCombinations(attributes)
    for (const object of objects) {
      const fields = createFields({ tables: Object.keys(object) as TableAttributesKeys[] })
      const excluded = all.filter(attr => !fields.tables.includes(attr))
      const actual = tableToTableAttributes(table, fields)

      expect(Object.keys(actual)).toHaveLength(fields.tables.length)
      for (const field of fields.tables.map(f => f as keyof TableAttributes)) expect(actual[field]).toEqual(table[field])
      for (const ex of excluded) expect(actual[ex]).not.toBeDefined()
    }
  })
})
