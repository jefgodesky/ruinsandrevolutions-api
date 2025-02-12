import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createFields } from '../../../types/fields.ts'
import UserResource from '../../../types/user-resource.ts'
import UserAttributes, { type UserAttributesKeys, userAttributes, createUserAttributes } from '../../../types/user-attributes.ts'
import { createUser } from '../../../types/user.ts'
import TableAttributes, { type TableAttributesKeys, tableAttributes, createTableAttributes } from '../../../types/table-attributes.ts'
import { createTable } from '../../../types/table.ts'
import type TableResource from '../../../types/table-resource.ts'
import getRoot from '../../get-root.ts'
import getAllFieldCombinations from '../../testing/get-all-field-combinations.ts'
import userToIncludedResource from '../user-to/included-resource.ts'
import tableToTableResponse from './table-response.ts'

describe('tableToTableResponse', () => {
  const userAttrs = createUserAttributes()
  const user = createUser({ ...userAttrs })
  const attributes = createTableAttributes()
  const table = createTable({ ...attributes, authors: [user] })
  const all = tableAttributes.map(field => field as keyof TableAttributes)

  it('generates a Response', () => {
    const actual = tableToTableResponse(table)
    const expected = {
      jsonapi: { version: '1.1' },
      links: {
        self: `${getRoot()}/tables/${table.slug}`,
        describedBy: `${getRoot()}/docs`
      },
      data: {
        type: 'tables',
        id: table.id,
        attributes,
        relationships: {
          authors: {
            data: [
              {
                type: 'users',
                id: table.authors[0].id
              }
            ]
          }
        }
      },
      included: table.authors.map(author => userToIncludedResource(author)),
    }
    expect(actual).toEqual(expected)
  })

  it('can return a sparse fieldset', () => {
    const objects = getAllFieldCombinations(attributes)
    for (const object of objects) {
      const fields = createFields({ tables: Object.keys(object) as TableAttributesKeys[] })
      const excluded = all.filter(attr => !fields.tables.includes(attr))
      const res = tableToTableResponse(table, fields)
      const attributes = (res.data as TableResource).attributes!

      expect(Object.keys(attributes)).toHaveLength(fields.tables.length)
      for (const field of fields.tables.map(f => f as keyof TableAttributes)) expect(attributes[field]).toBe(table[field])
      for (const ex of excluded) expect(attributes[ex]).not.toBeDefined()
    }
  })

  it('can return a sparse fieldset (authors)', () => {
    const objects = getAllFieldCombinations(userAttrs)
    for (const object of objects) {
      const fields = createFields({ users: Object.keys(object) as UserAttributesKeys[] })
      const excluded = userAttributes.filter(attr => !fields.users.includes(attr))
      const res = tableToTableResponse(table, fields)
      const included = res.included as UserResource[]

      for (const item of included) {
        const attributes = item.attributes as UserAttributes
        expect(item.type).toBe('users')
        expect(Object.keys(attributes)).toHaveLength(fields.users.length)
        for (const field of fields.users) expect(attributes[field]).toBe(table.authors[0][field])
        for (const ex of excluded) expect(attributes[ex]).not.toBeDefined()
      }
    }
  })
})
