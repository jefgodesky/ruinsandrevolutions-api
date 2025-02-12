import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import ItemRecord from '../../../types/item-record.ts'
import { createUser } from '../../../types/user.ts'
import Table, { isTable } from '../../../types/table.ts'
import { createTableAttributes } from '../../../types/table-attributes.ts'
import itemRecordAndAuthorsToTable from './table.ts'

describe('itemRecordAndAuthorsToTable', () => {
  const { rolls, rows, ...attributes } = createTableAttributes()
  const authors = [createUser()]
  const copiedFields: Array<keyof Table & keyof ItemRecord> = ['id', 'name', 'slug', 'description', 'body', 'attribution', 'created', 'updated']
  const record: ItemRecord = {
    id: crypto.randomUUID(),
    type: 'table',
    data: JSON.parse(JSON.stringify({ rolls, rows })),
    ...attributes
  }

  it('returns a Table', () => {
    const actual = itemRecordAndAuthorsToTable(record, authors)

    expect(isTable(actual)).toBe(true)
    expect(actual.authors).toHaveLength(authors.length)
    expect(actual.authors[0].id).toBe(authors[0].id)
    expect(actual.rolls).toEqual(rolls)
    expect(actual.rows).toEqual(rows)
    for (const field of copiedFields) {
      expect(actual[field]).toEqual(record[field])
    }
  })
})
