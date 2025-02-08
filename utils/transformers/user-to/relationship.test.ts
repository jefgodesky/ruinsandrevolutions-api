import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createUser } from '../../../types/user.ts'
import getRoot from '../../get-root.ts'
import userToRelationship from './relationship.ts'

describe('userToRelationship', () => {
  const user = createUser()

  it('returns a relationship object', () => {
    const self = `${getRoot()}/tests/1/relationships/author`
    const expected = {
      links: { self },
      data: {
        type: 'users',
        id: user.id
      }
    }

    const actual = userToRelationship(user, self)
    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected))
  })

  it('can take an array of users', () => {
    const user2 = createUser()
    const self = `${getRoot()}/tests/1/relationships/authors`
    const expected = {
      links: { self },
      data: [
        { type: 'users', id: user.id },
        { type: 'users', id: user2.id },
      ]
    }

    const actual = userToRelationship([user, user2], self)
    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected))
  })
})
