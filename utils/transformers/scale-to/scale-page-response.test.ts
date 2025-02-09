import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createScale } from '../../../types/scale.ts'
import { createUser } from '../../../types/user.ts'
import getRoot from '../../get-root.ts'
import userToIncludedResource from '../user-to/included-resource.ts'
import scaleToScaleResource from './scale-resource.ts'
import scalesToScalePageResponse from './scale-page-response.ts'

describe('scalesToScalePageResponse', () => {
  const user = createUser()
  const scale = createScale({ authors: [user] })

  it('generates a paginated Response', () => {
    const actual = scalesToScalePageResponse([scale], 2, 0, 1)
    const self = `${getRoot()}/scales`
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
        scaleToScaleResource(scale)
      ],
      included: [userToIncludedResource(user)]
    }
    expect(actual).toEqual(expected)
  })
})
