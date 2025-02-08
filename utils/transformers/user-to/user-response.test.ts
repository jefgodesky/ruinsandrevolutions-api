import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createFields } from '../../../types/fields.ts'
import UserAttributes, { type UserAttributesKeys, userAttributes } from '../../../types/user-attributes.ts'
import type User from '../../../types/user.ts'
import type UserResource from '../../../types/user-resource.ts'
import getRoot from '../../get-root.ts'
import getAllFieldCombinations from '../../testing/get-all-field-combinations.ts'
import userToUserResponse from './user-response.ts'

describe('userToUserResponse', () => {
  const attributes: UserAttributes = {
    name: 'John Doe',
    username: 'john',
  }

  const user: User = {
    id: crypto.randomUUID(),
    name: attributes.name!,
    username: attributes.username
  }

  it('generates a Response', () => {
    const actual = userToUserResponse(user)
    const expected = {
      jsonapi: { version: '1.1' },
      links: {
        self: `${getRoot()}/users/${user.id}`,
        describedBy: `${getRoot()}/docs`
      },
      data: {
        type: 'users',
        id: user.id,
        attributes: {
          name: user.name,
          username: user.username
        }
      }
    }
    expect(actual).toEqual(expected)
  })

  it('can return a sparse fieldset', () => {
    const objects = getAllFieldCombinations(attributes)
    for (const object of objects) {
      const fields = createFields({ users: Object.keys(object) as UserAttributesKeys[] })
      const excluded = userAttributes.filter(attr => !fields.users.includes(attr))
      const res = userToUserResponse(user, fields)
      const attributes = (res.data as UserResource).attributes!

      expect(Object.keys(attributes)).toHaveLength(fields.users.length)
      for (const field of fields.users) expect(attributes[field]).toBe(user[field])
      for (const ex of excluded) expect(attributes[ex]).not.toBeDefined()
    }
  })
})
