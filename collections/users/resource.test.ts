import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import User from './model.ts'
import {
  type UserAttributesKeys,
  makeUserLink,
  makeUserAttributes,
  makeUserResponse
} from './resource.ts'

describe('UserResource methods', () => {
  const user: User = {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'John Doe',
    username: 'john',
    key: '22222222-2222-2222-2222-222222222222'
  }

  const unsaved: User = {
    name: 'John Doe',
    username: 'john',
    key: '22222222-2222-2222-2222-222222222222'
  }

  describe('makeUserLink', () => {
    it('returns a link to a UserResource', () => {
      const expected = 'http://localhost:8001/v1/users/11111111-1111-1111-1111-111111111111'
      expect(makeUserLink(user)).toBe(expected)
    })

    it('returns a link to the Users collection if user has no ID', () => {
      const expected = 'http://localhost:8001/v1/users'
      expect(makeUserLink(unsaved)).toBe(expected)
    })
  })

  describe('makeUserAttributes', () => {
    it('returns a UserAttributes object', () => {
      const actual = makeUserAttributes(user)
      expect(Object.keys(actual)).toHaveLength(2)
      expect(actual.name).toBe(user.name)
      expect(actual.username).toBe(user.username)
    })

    it('can return a sparse fieldset', () => {
      const scenarios: [UserAttributesKeys[], UserAttributesKeys[], string[]][] = [
        [['name'], ['username'], [user.name]],
        [['username'], ['name'], [user.username ?? '']],
        [['name', 'username'], [], [user.name, user.username ?? '']],
      ]

      for (const [included, excluded, expected] of scenarios) {
        const actual = makeUserAttributes(user, included)
        expect(Object.keys(actual)).toHaveLength(included.length)
        for (let i = 0; i < included.length; i++) expect(actual[included[i]]).toBe(expected[i])
        for (const ex of excluded) expect(actual[ex]).not.toBeDefined()
      }
    })
  })

  describe('makeUserResponse', () => {
    it('generates a Response', () => {
      const actual = makeUserResponse(user)
      const expected = {
        jsonapi: { version: '1.1' },
        links: {
          self: 'http://localhost:8001/v1/users/11111111-1111-1111-1111-111111111111'
        },
        data: [
          {
            type: 'users',
            id: user.id,
            attributes: {
              name: user.name,
              username: user.username
            }
          }
        ]
      }
      expect(actual).toEqual(expected)
    })

      it('can return a sparse fieldset', () => {
      const withName = makeUserResponse(user, ['name'])
      const withUsername = makeUserResponse(user, ['username'])
      expect(withName.data[0].attributes?.name).toBe(user.name)
      expect(withName.data[0].attributes?.username).not.toBeDefined()
      expect(withUsername.data[0].attributes?.name).not.toBeDefined()
      expect(withUsername.data[0].attributes?.username).toBe(user.username)
    })
  })
})