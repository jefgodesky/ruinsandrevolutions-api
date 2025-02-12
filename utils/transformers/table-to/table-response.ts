import type Fields from '../../../types/fields.ts'
import type Table from '../../../types/table.ts'
import type Response from '../../../types/response.ts'
import getJSONAPI from '../../get-jsonapi.ts'
import getRoot from '../../get-root.ts'
import tableToLink from './link.ts'
import tableToTableResource from './table-resource.ts'
import userToIncludedResource from '../user-to/included-resource.ts'

const tableToTableResponse = (table: Table, fields?: Fields): Response => {
  return {
    jsonapi: getJSONAPI(),
    links: {
      self: tableToLink(table),
      describedBy: getRoot() + '/docs'
    },
    data: tableToTableResource(table, fields),
    included: table.authors.map(author => userToIncludedResource(author, fields))
  }
}

export default tableToTableResponse
