import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createFields } from '../../../types/fields.ts'
import { createUser } from '../../../types/user.ts'
import { type UserAttributesKeys, userAttributes, createUserAttributes }  from '../../../types/user-attributes.ts'
import getRoot from '../../get-root.ts'
import getAllFieldCombinations from '../../testing/get-all-field-combinations.ts'
import userToIncludedResource from './included-resource.ts'

describe('userToIncludedResource', () => {
  const attributes = createUserAttributes()
  const user = createUser({ ...attributes })

  it('returns an included resouce object', () => {
    const actual = userToIncludedResource(user)
    const expected = {
      links: {
        self: `${getRoot()}/users/${user.id}`
      },
      type: 'users',
      id: user.id,
      attributes: {
        name: user.name,
        username: user.username
      }
    }
    expect(actual).toEqual(expected)
  })

  it('can return a sparse fieldset', () => {
    const objects = getAllFieldCombinations(attributes)
    for (const object of objects) {
      const fields = createFields({ users: Object.keys(object) as UserAttributesKeys[] })
      const excluded = userAttributes.filter(attr => !fields.users.includes(attr))
      const actual = userToIncludedResource(user, fields)
      const attributes = actual.attributes!

      expect(Object.keys(attributes)).toHaveLength(fields.users.length)
      for (const field of fields.users) expect(attributes[field]).toBe(user[field])
      for (const ex of excluded) expect(attributes[ex]).not.toBeDefined()
    }
  })
})
