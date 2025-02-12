import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type ItemRecord from '../../../types/item-record.ts'
import type TableAttributes from '../../../types/table-attributes.ts'
import { createTableCreation } from '../../../types/table-creation.ts'
import tableCreationToItemRecord from './item-record.ts'

describe('tableCreationToItemRecord', () => {
  it('returns an Item Record', () => {
    const post = createTableCreation()
    const actual = tableCreationToItemRecord(post)
    const copiedFields: Array<keyof TableAttributes & keyof ItemRecord> = ['name', 'slug', 'description', 'body', 'attribution', 'created', 'updated']
    const { rows, rolls } = post.data.attributes

    expect(actual.type).toBe('table')
    expect(actual.data).toEqual({ rows, rolls })
    for (const field of copiedFields) {
      expect(actual[field]).toEqual(post.data.attributes[field])
    }
  })
})
