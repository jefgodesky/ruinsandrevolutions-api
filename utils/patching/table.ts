import type Table from '../../types/table.ts'
import type TableAttributes from '../../types/table-attributes.ts'
import type TablePatch from '../../types/table-patch.ts'
import type TableRollMethod from '../../types/table-roll-method.ts'
import type TableRow from '../../types/table-row.ts'
import UserResource from '../../types/user-resource.ts'

const patchTable = (table: Table, patch: TablePatch): Table => {
  const patched = structuredClone(table)

  const patchedKeys = Object.keys(patch.data.attributes) as (keyof TableAttributes)[]
  for (const key of patchedKeys) {
    patched[key] = patch.data.attributes[key] as string & string[] & Record<string, TableRollMethod> & TableRow[] & Date
  }

  if (patch.data.relationships?.authors?.data) {
    const resources = structuredClone(patch.data.relationships.authors.data) as UserResource[]
    patched.authors = resources.map(res => ({ id: res.id, name: '' }))
  }

  patched.updated = new Date()
  return patched
}

export default patchTable
