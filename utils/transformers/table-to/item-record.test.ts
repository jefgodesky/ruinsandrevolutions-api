import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import ItemRecord from '../../../types/item-record.ts'
import Table, { createTable } from '../../../types/table.ts'
import tableToItemRecord from './item-record.ts'

describe('tableToItemRecord', () => {
  it('returns an Item Record', () => {
    const table = createTable()
    const actual = tableToItemRecord(table)
    const copiedFields: Array<keyof Table & keyof ItemRecord> = ['id', 'name', 'slug', 'description', 'body', 'attribution', 'created', 'updated']

    expect(actual.type).toBe('table')
    expect(actual.data).toEqual({ methods: table.methods, rows: table.rows })
    for (const field of copiedFields) {
      expect(actual[field]).toEqual(table[field])
    }
  })
})
