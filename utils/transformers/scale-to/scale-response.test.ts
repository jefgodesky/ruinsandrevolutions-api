import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createFields } from '../../../types/fields.ts'
import UserResource from '../../../types/user-resource.ts'
import UserAttributes, { type UserAttributesKeys, userAttributes, createUserAttributes } from '../../../types/user-attributes.ts'
import { createUser } from '../../../types/user.ts'
import ScaleAttributes, { type ScaleAttributesKeys, scaleAttributes, createScaleAttributes } from '../../../types/scale-attributes.ts'
import { createScale } from '../../../types/scale.ts'
import type ScaleResource from '../../../types/scale-resource.ts'
import getRoot from '../../get-root.ts'
import getAllFieldCombinations from '../../testing/get-all-field-combinations.ts'
import userToIncludedResource from '../user-to/included-resource.ts'
import scaleToScaleResponse from './scale-response.ts'

describe('scaleToScaleResponse', () => {
  const userAttrs = createUserAttributes()
  const user = createUser({ ...userAttrs })
  const attributes = createScaleAttributes()
  const scale = createScale({ ...attributes, authors: [user] })
  const all = scaleAttributes.map(field => field as keyof ScaleAttributes)

  it('generates a Response', () => {
    const actual = scaleToScaleResponse(scale)
    const expected = {
      jsonapi: { version: '1.1' },
      links: {
        self: `${getRoot()}/scales/${scale.slug}`,
        describedBy: `${getRoot()}/docs`
      },
      data: {
        type: 'scales',
        id: scale.id,
        attributes,
        relationships: {
          authors: {
            data: [
              {
                type: 'users',
                id: scale.authors[0].id
              }
            ]
          }
        }
      },
      included: scale.authors.map(author => userToIncludedResource(author)),
    }
    expect(actual).toEqual(expected)
  })

  it('can return a sparse fieldset', () => {
    const objects = getAllFieldCombinations(attributes)
    for (const object of objects) {
      const fields = createFields({ scales: Object.keys(object) as ScaleAttributesKeys[] })
      const excluded = all.filter(attr => !fields.scales.includes(attr))
      const res = scaleToScaleResponse(scale, fields)
      const attributes = (res.data as ScaleResource).attributes!

      expect(Object.keys(attributes)).toHaveLength(fields.scales.length)
      for (const field of fields.scales.map(f => f as keyof ScaleAttributes)) expect(attributes[field]).toBe(scale[field])
      for (const ex of excluded) expect(attributes[ex]).not.toBeDefined()
    }
  })

  it('can return a sparse fieldset (authors)', () => {
    const objects = getAllFieldCombinations(userAttrs)
    for (const object of objects) {
      const fields = createFields({ users: Object.keys(object) as UserAttributesKeys[] })
      const excluded = userAttributes.filter(attr => !fields.users.includes(attr))
      const res = scaleToScaleResponse(scale, fields)
      const included = res.included as UserResource[]

      for (const item of included) {
        const attributes = item.attributes as UserAttributes
        expect(item.type).toBe('users')
        expect(Object.keys(attributes)).toHaveLength(fields.users.length)
        for (const field of fields.users) expect(attributes[field]).toBe(scale.authors[0][field])
        for (const ex of excluded) expect(attributes[ex]).not.toBeDefined()
      }
    }
  })
})
