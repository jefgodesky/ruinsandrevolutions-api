import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createUser } from '../../../types/user.ts'
import getRoot from '../../get-root.ts'
import usersToUserPageResponse from './user-page-response.ts'

describe('usersToUserPageResponse', () => {
  const user = createUser()

  it('generates a paginated Response', () => {
    const actual = usersToUserPageResponse([user], 2, 0, 1)
    const self = `${getRoot()}/users`
    const expected = {
      jsonapi: { version: '1.1' },
      links: {
        self,
        first: `${self}?offset=0&limit=1`,
        prev: `${self}?offset=0&limit=1`,
        next: `${self}?offset=1&limit=1`,
        last: `${self}?offset=1&limit=1`,
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
})
