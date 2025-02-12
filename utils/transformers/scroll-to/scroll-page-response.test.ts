import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createScroll } from '../../../types/scroll.ts'
import { createUser } from '../../../types/user.ts'
import getRoot from '../../get-root.ts'
import userToIncludedResource from '../user-to/included-resource.ts'
import scrollToScrollResource from './scroll-resource.ts'
import scrollsToScrollPageResponse from './scroll-page-response.ts'

describe('scrollsToScrollPageResponse', () => {
  const user = createUser()
  const scroll = createScroll({ authors: [user] })

  it('generates a paginated Response', () => {
    const actual = scrollsToScrollPageResponse([scroll], 2, 0, 1)
    const self = `${getRoot()}/scrolls`
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
        scrollToScrollResource(scroll)
      ],
      included: [userToIncludedResource(user)]
    }
    expect(actual).toEqual(expected)
  })
})
