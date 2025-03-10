import type ItemRecord from '../../../types/item-record.ts'
import type TableCreation from '../../../types/table-creation.ts'

const tableCreationToItemRecord = (post: TableCreation): ItemRecord => {
  const { name, slug, description, body, attribution, rows, methods, created, updated } = post.data.attributes
  const type = 'table'
  const data = JSON.parse(JSON.stringify({ rows, methods }))
  return { type, name, slug, description, body, attribution, data, created, updated }
}

export default tableCreationToItemRecord
