import type Table from '../../../types/table.ts'
import getRoot from '../../get-root.ts'

const tableToLink = (table: Table): string => {
  const root = getRoot()
  const collection = 'tables'
  const id = table.slug ?? table.id
  const path = id ? [root, collection, id] : [root, collection]
  return path.join('/')
}

export default tableToLink
