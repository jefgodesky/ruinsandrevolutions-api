import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import ItemRecord, { createItemRecord } from '../../../types/item-record.ts'
import { createUser } from '../../../types/user.ts'
import Scale, { isScale } from '../../../types/scale.ts'
import itemRecordAndAuthorsToScale from './scale.ts'

describe('itemRecordAndAuthorsToScale', () => {
  it('returns a Scale', () => {
    const record = createItemRecord()
    const authors = [createUser()]
    const copiedFields: Array<keyof Scale & keyof ItemRecord> = ['id', 'name', 'slug', 'description', 'body', 'attribution', 'created', 'updated']
    const actual = itemRecordAndAuthorsToScale(record, authors)

    expect(isScale(actual)).toBe(true)
    expect(actual.authors).toHaveLength(authors.length)
    expect(actual.authors[0].id).toBe(authors[0].id)
    expect(actual.levels).toEqual(record.data)
    for (const field of copiedFields) {
      expect(actual[field]).toEqual(record[field])
    }
  })
})
