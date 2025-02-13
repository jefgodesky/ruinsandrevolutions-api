import type ItemRecord from '../../../types/item-record.ts'
import type Table from '../../../types/table.ts'
import type TableRollMethod from '../../../types/table-roll-method.ts'
import type TableRow from '../../../types/table-row.ts'

const tableToItemRecord = (table: Table): ItemRecord => {
  const data: { methods: Record<string, TableRollMethod>, rows: TableRow[] } = { methods: table.methods, rows: table.rows }

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
