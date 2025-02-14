import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createTable } from '../../../types/table.ts'
import { createUser } from '../../../types/user.ts'
import getRoot from '../../get-root.ts'
import userToIncludedResource from '../user-to/included-resource.ts'
import tableToTableResource from './table-resource.ts'
import tablesToTablePageResponse from './table-page-response.ts'

describe('tablesToTablePageResponse', () => {
  const user = createUser()
  const table = createTable({ authors: [user] })

  it('generates a paginated Response', () => {
    const actual = tablesToTablePageResponse([table], 2, 0, 1)
    const self = `${getRoot()}/tables`
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
        tableToTableResource(table)
      ],
      included: [userToIncludedResource(user)]
    }
    expect(actual).toEqual(expected)
  })
})
