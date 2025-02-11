import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createFields } from '../../../types/fields.ts'
import UserResource from '../../../types/user-resource.ts'
import UserAttributes, { type UserAttributesKeys, userAttributes, createUserAttributes } from '../../../types/user-attributes.ts'
import { createUser } from '../../../types/user.ts'
import ScrollAttributes, { type ScrollAttributesKeys, scrollAttributes, createScrollAttributes } from '../../../types/scroll-attributes.ts'
import { createScroll } from '../../../types/scroll.ts'
import type ScrollResource from '../../../types/scroll-resource.ts'
import getRoot from '../../get-root.ts'
import getAllFieldCombinations from '../../testing/get-all-field-combinations.ts'
import userToIncludedResource from '../user-to/included-resource.ts'
import scrollToScrollResponse from './scroll-response.ts'

describe('scrollToScrollResponse', () => {
  const userAttrs = createUserAttributes()
  const user = createUser({ ...userAttrs })
  const attributes = createScrollAttributes()
  const scroll = createScroll({ ...attributes, authors: [user] })
  const all = scrollAttributes.map(field => field as keyof ScrollAttributes)

  it('generates a Response', () => {
    const actual = scrollToScrollResponse(scroll)
    const expected = {
      jsonapi: { version: '1.1' },
      links: {
        self: `${getRoot()}/scrolls/${scroll.slug}`,
        describedBy: `${getRoot()}/docs`
      },
      data: {
        type: 'scrolls',
        id: scroll.id,
        attributes,
        relationships: {
          authors: {
            data: [
              {
                type: 'users',
                id: scroll.authors[0].id
              }
            ]
          }
        }
      },
      included: scroll.authors.map(author => userToIncludedResource(author)),
    }
    expect(actual).toEqual(expected)
  })

  it('can return a sparse fieldset', () => {
    const objects = getAllFieldCombinations(attributes)
    for (const object of objects) {
      const fields = createFields({ scrolls: Object.keys(object) as ScrollAttributesKeys[] })
      const excluded = all.filter(attr => !fields.scrolls.includes(attr))
      const res = scrollToScrollResponse(scroll, fields)
      const attributes = (res.data as ScrollResource).attributes!

      expect(Object.keys(attributes)).toHaveLength(fields.scrolls.length)
      for (const field of fields.scrolls.map(f => f as keyof ScrollAttributes)) expect(attributes[field]).toBe(scroll[field])
      for (const ex of excluded) expect(attributes[ex]).not.toBeDefined()
    }
  })

  it('can return a sparse fieldset (authors)', () => {
    const objects = getAllFieldCombinations(userAttrs)
    for (const object of objects) {
      const fields = createFields({ users: Object.keys(object) as UserAttributesKeys[] })
      const excluded = userAttributes.filter(attr => !fields.users.includes(attr))
      const res = scrollToScrollResponse(scroll, fields)
      const included = res.included as UserResource[]

      for (const item of included) {
        const attributes = item.attributes as UserAttributes
        expect(item.type).toBe('users')
        expect(Object.keys(attributes)).toHaveLength(fields.users.length)
        for (const field of fields.users) expect(attributes[field]).toBe(scroll.authors[0][field])
        for (const ex of excluded) expect(attributes[ex]).not.toBeDefined()
      }
    }
  })
})
