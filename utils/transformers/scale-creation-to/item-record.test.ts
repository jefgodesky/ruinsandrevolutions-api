import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type ItemRecord from '../../../types/item-record.ts'
import type ScaleAttributes from '../../../types/scale-attributes.ts'
import { createScaleCreation } from '../../../types/scale-creation.ts'
import scaleCreationToItemRecord from './item-record.ts'

describe('scaleCreationToItemRecord', () => {
  it('returns an Item Record', () => {
    const post = createScaleCreation()
    const actual = scaleCreationToItemRecord(post)
    const copiedFields: Array<keyof ScaleAttributes & keyof ItemRecord> = ['name', 'slug', 'description', 'body', 'attribution', 'created', 'updated']

    expect(actual.type).toBe('scale')
    expect(actual.data).toEqual(post.data.attributes.levels)
    for (const field of copiedFields) {
      expect(actual[field]).toEqual(post.data.attributes[field])
    }
  })
})
