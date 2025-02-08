import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createUser } from '../../../types/user.ts'
import getRoot from '../../get-root.ts'
import userToLink from './link.ts'

describe('userToLink', () => {
  const user = createUser()

  it('returns a link to a UserResource', () => {
    const expected = `${getRoot()}/users/${user.id}`
    expect(userToLink(user)).toBe(expected)
  })

  it('returns a link to the Users collection if user has no ID', () => {
    const { id: _, ...attributes } = user
    const expected = `${getRoot()}/users`
    expect(userToLink({ ...attributes })).toBe(expected)
  })
})
