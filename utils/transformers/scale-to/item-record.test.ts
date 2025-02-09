import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import ItemRecord from '../../../types/item-record.ts'
import Scale, { createScale } from '../../../types/scale.ts'
import scaleToItemRecord from './item-record.ts'

describe('scaleToItemRecord', () => {
  it('returns an Item Record', () => {
    const scale = createScale()
    const actual = scaleToItemRecord(scale)
    const copiedFields: Array<keyof Scale & keyof ItemRecord> = ['id', 'name', 'slug', 'description', 'body', 'attribution', 'created', 'updated']

    expect(actual.type).toBe('scale')
    expect(actual.data).toEqual(scale.levels)
    for (const field of copiedFields) {
      expect(actual[field]).toEqual(scale[field])
    }
  })
})
