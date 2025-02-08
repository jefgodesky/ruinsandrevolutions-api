import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createUser } from '../../../types/user.ts'
import getRoot from '../../get-root.ts'
import userToRelLink from './rel-link.ts'

describe('userToRelLink', () => {
  const user = createUser()

  it('returns a link to a user relationship', () => {
    const expected = `${getRoot()}/users/${user.id}/relationships/author`
    expect(userToRelLink(user, 'author')).toBe(expected)
  })

  it('returns a link to the Users collection if user has no ID', () => {
    const { id: _, ...attributes } = user
    const expected = `${getRoot()}/users`
    expect(userToRelLink({ ...attributes }, 'author')).toBe(expected)
  })
})
