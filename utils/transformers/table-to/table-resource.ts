import type Fields from '../../../types/fields.ts'
import type Table from '../../../types/table.ts'
import type TableResource from '../../../types/table-resource.ts'
import tableToTableAttributes from './table-attributes.ts'

const tableToTableResource = (table: Table, fields?: Fields): TableResource => {
  const id = table.id ?? 'ERROR'
  return {
    type: 'tables',
    id,
    attributes: tableToTableAttributes(table, fields),
    relationships: {
      authors: {
        data: table.authors.map(author => ({ type: 'users', id: author.id ?? 'ERROR' }))
      }
    }
  }
}

export default tableToTableResource
