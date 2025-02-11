import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type ItemRecord from '../../../types/item-record.ts'
import type ScrollAttributes from '../../../types/scroll-attributes.ts'
import { createScrollCreation } from '../../../types/scroll-creation.ts'
import scrollCreationToItemRecord from './item-record.ts'

describe('scrollCreationToItemRecord', () => {
  it('returns an Item Record', () => {
    const post = createScrollCreation()
    const actual = scrollCreationToItemRecord(post)
    const copiedFields: Array<keyof ScrollAttributes & keyof ItemRecord> = ['name', 'slug', 'description', 'body', 'attribution', 'created', 'updated']

    expect(actual.type).toBe('scroll')
    expect(actual.data).toEqual({ start: post.data.attributes.start })
    for (const field of copiedFields) {
      expect(actual[field]).toEqual(post.data.attributes[field])
    }
  })
})
