import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import ItemRecord from '../../../types/item-record.ts'
import { createUser } from '../../../types/user.ts'
import Scroll, { isScroll } from '../../../types/scroll.ts'
import { createScrollAttributes } from '../../../types/scroll-attributes.ts'
import itemRecordAndAuthorsToScroll from './scroll.ts'

describe('itemRecordAndAuthorsToScroll', () => {
  const { start, notes, ...attributes } = createScrollAttributes()
  const authors = [createUser()]
  const copiedFields: Array<keyof Scroll & keyof ItemRecord> = ['id', 'name', 'slug', 'description', 'body', 'attribution', 'created', 'updated']
  const record: ItemRecord = {
    id: crypto.randomUUID(),
    type: 'scroll',
    data: JSON.parse(JSON.stringify({ start })),
    ...attributes
  }

  it('returns a Scroll', () => {
    const actual = itemRecordAndAuthorsToScroll(record, authors)

    expect(isScroll(actual)).toBe(true)
    expect(actual.authors).toHaveLength(authors.length)
    expect(actual.authors[0].id).toBe(authors[0].id)
    expect(actual.start).toEqual(start)
    for (const field of copiedFields) {
      expect(actual[field]).toEqual(record[field])
    }
  })
})
