import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createFields } from '../../../types/fields.ts'
import { createScroll } from '../../../types/scroll.ts'
import ScrollAttributes, { type ScrollAttributesKeys, scrollAttributes, createScrollAttributes } from '../../../types/scroll-attributes.ts'
import getAllFieldCombinations from '../../testing/get-all-field-combinations.ts'
import scrollToScrollResource from './scroll-resource.ts'

describe('scrollToScrollResource', () => {
  const attributes = createScrollAttributes()
  const scroll = createScroll({ ...attributes })
  const all = scrollAttributes.map(field => field as keyof ScrollAttributes)

  it('returns a ScrollResource object', () => {
    const actual = scrollToScrollResource(scroll)
    const expected = {
      type: 'scrolls',
      id: scroll.id,
      attributes,
      relationships: {
        authors: {
          data: [
            { type: 'users', id: scroll.authors[0].id }
          ]
        }
      }
    }
    expect(actual).toEqual(expected)
  })

  it('can return a sparse fieldset', () => {
    const objects = getAllFieldCombinations(attributes)
    for (const object of objects) {
      const fields = createFields({ scrolls: Object.keys(object) as ScrollAttributesKeys[] })
      const excluded = all.filter(attr => !fields.scrolls.includes(attr))
      const actual = scrollToScrollResource(scroll, fields)
      const attributes = actual.attributes!

      expect(Object.keys(attributes)).toHaveLength(fields.scrolls.length)
      for (const field of (fields.scrolls as (keyof ScrollAttributes)[])) expect(attributes[field]).toBe(scroll[field])
      for (const ex of excluded) expect(attributes[ex]).not.toBeDefined()
    }
  })
})
