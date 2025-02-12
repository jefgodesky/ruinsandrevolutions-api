import { intersect } from '@std/collections'
import type Fields from '../../../types/fields.ts'
import type Note from '../../../types/note.ts'
import type Table from '../../../types/table.ts'
import type TableRow from '../../../types/table-row.ts'
import TableAttributes, { tableAttributes } from '../../../types/table-attributes.ts'

const tableToTableAttributes = (table: Table, fields?: Fields): Partial<TableAttributes> => {
  const requested = intersect(fields?.tables ?? tableAttributes, tableAttributes) as (keyof TableAttributes)[]
  const attributes: Partial<TableAttributes> = {}
  for (const field of requested) {
    const value = table[field] as (string & TableRow[] & Note[] & Date) | undefined
    if (value) attributes[field] = value
  }
  return attributes
}

export default tableToTableAttributes
