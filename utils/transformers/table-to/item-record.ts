import type ItemRecord from '../../../types/item-record.ts'
import type Table from '../../../types/table.ts'
import type TableRow from '../../../types/table-row.ts'
import type Note from '../../../types/note.ts'

const tableToItemRecord = (table: Table): ItemRecord => {
  const data: { rolls: Note[], rows: TableRow[] } = { rolls: table.rolls, rows: table.rows }

  return {
    id: table.id,
    type: 'table',
    name: table.name,
    slug: table.slug,
    description: table.description,
    body: table.body,
    attribution: table.attribution,
    data: JSON.parse(JSON.stringify(data)),
    created: table.created,
    updated: table.updated
  }
}

export default tableToItemRecord
