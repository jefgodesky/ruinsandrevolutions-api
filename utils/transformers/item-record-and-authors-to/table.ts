import type ItemRecord from '../../../types/item-record.ts'
import type Table from '../../../types/table.ts'
import type User from '../../../types/user.ts'
import { isTableRollMethodDict } from '../../../types/table-roll-method.ts'
import { areTableRows } from '../../../types/table-row.ts'

const itemRecordAndAuthorsToTable = (record: ItemRecord, authors: User[]): Table => {
  const data = record.data as Record<string, unknown>
  const methods = isTableRollMethodDict(data.methods) ? data.methods : {}
  const rows = areTableRows(data.rows) ? data.rows : []

  return {
    id: record.id ?? 'ERROR',
    name: record.name,
    slug: record.slug,
    description: record.description,
    body: record.body,
    attribution: record.attribution,
    authors,
    methods,
    rows,
    created: record.created,
    updated: record.updated
  }
}

export default itemRecordAndAuthorsToTable
