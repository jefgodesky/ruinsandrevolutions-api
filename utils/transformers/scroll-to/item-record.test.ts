import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import ItemRecord from '../../../types/item-record.ts'
import Scroll, { createScroll } from '../../../types/scroll.ts'
import scrollToItemRecord from './item-record.ts'

describe('scrollToItemRecord', () => {
  it('returns an Item Record', () => {
    const scroll = createScroll()
    const actual = scrollToItemRecord(scroll)
    const copiedFields: Array<keyof Scroll & keyof ItemRecord> = ['id', 'name', 'slug', 'description', 'body', 'attribution', 'created', 'updated']

    expect(actual.type).toBe('scroll')
    expect(actual.data).toEqual({ start: scroll.start })
    for (const field of copiedFields) {
      expect(actual[field]).toEqual(scroll[field])
    }
  })
})
