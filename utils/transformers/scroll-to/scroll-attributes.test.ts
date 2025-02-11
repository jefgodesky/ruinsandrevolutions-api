import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createFields } from '../../../types/fields.ts'
import { createScroll } from '../../../types/scroll.ts'
import ScrollAttributes, { type ScrollAttributesKeys, scrollAttributes, createScrollAttributes } from '../../../types/scroll-attributes.ts'
import getAllFieldCombinations from '../../testing/get-all-field-combinations.ts'
import scrollToScrollAttributes from './scroll-attributes.ts'

describe('scrollToScrollAttributes', () => {
  const attributes = createScrollAttributes()
  const scroll = createScroll({ ...attributes })
  const all = scrollAttributes.map(field => field as keyof ScrollAttributes)

  it('returns a ScrollAttributes partial', () => {
    const actual = scrollToScrollAttributes(scroll)
    for (const field of all) {
      expect(actual[field]).toEqual(scroll[field])
    }
  })

  it('can return a sparse fieldset', () => {
    const objects = getAllFieldCombinations(attributes)
    for (const object of objects) {
      const fields = createFields({ scrolls: Object.keys(object) as ScrollAttributesKeys[] })
      const excluded = all.filter(attr => !fields.scrolls.includes(attr))
      const actual = scrollToScrollAttributes(scroll, fields)

      expect(Object.keys(actual)).toHaveLength(fields.scrolls.length)
      for (const field of fields.scrolls.map(f => f as keyof ScrollAttributes)) expect(actual[field]).toEqual(scroll[field])
      for (const ex of excluded) expect(actual[ex]).not.toBeDefined()
    }
  })
})
