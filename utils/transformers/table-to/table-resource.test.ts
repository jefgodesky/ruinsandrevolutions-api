import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createFields } from '../../../types/fields.ts'
import { createTable } from '../../../types/table.ts'
import TableAttributes, { type TableAttributesKeys, tableAttributes, createTableAttributes } from '../../../types/table-attributes.ts'
import getAllFieldCombinations from '../../testing/get-all-field-combinations.ts'
import tableToTableResource from './table-resource.ts'

describe('tableToTableResource', () => {
  const attributes = createTableAttributes()
  const table = createTable({ ...attributes })
  const all = tableAttributes.map(field => field as keyof TableAttributes)

  it('returns a TableResource object', () => {
    const actual = tableToTableResource(table)
    const expected = {
      type: 'tables',
      id: table.id,
      attributes,
      relationships: {
        authors: {
          data: [
            { type: 'users', id: table.authors[0].id }
          ]
        }
      }
    }
    expect(actual).toEqual(expected)
  })

  it('can return a sparse fieldset', () => {
    const objects = getAllFieldCombinations(attributes)
    for (const object of objects) {
      const fields = createFields({ tables: Object.keys(object) as TableAttributesKeys[] })
      const excluded = all.filter(attr => !fields.tables.includes(attr))
      const actual = tableToTableResource(table, fields)
      const attributes = actual.attributes!

      expect(Object.keys(attributes)).toHaveLength(fields.tables.length)
      for (const field of (fields.tables as (keyof TableAttributes)[])) expect(attributes[field]).toBe(table[field])
      for (const ex of excluded) expect(attributes[ex]).not.toBeDefined()
    }
  })
})
