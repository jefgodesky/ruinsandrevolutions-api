import TableAttributes, { createTableAttributes, isTableAttributesPartial } from './table-attributes.ts'
import UserRelationship, { isUserRelationship } from './user-relationship.ts'
import User, { isUser } from './user.ts'
import isObject from '../utils/guards/object.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface TablePatch {
  data: {
    type: 'tables'
    id: string
    attributes: Partial<TableAttributes>
    relationships?: {
      authors?: UserRelationship
    }
  }
}

const createTablePatch = (
  overrides?: Partial<TableAttributes>,
  authors: (User | string)[] = [crypto.randomUUID()]
): TablePatch => {
  const attributes = createTableAttributes(overrides)
  delete attributes.created
  delete attributes.updated

  return {
    data: {
      type: 'tables',
      id: crypto.randomUUID(),
      attributes,
      relationships: {
        authors: {
          data: authors.map(a => {
            const type = 'users'
            const id = isUser(a) ? a.id ?? 'ERROR' : a
            return { type, id }
          })
        }
      }
    }
  }
}

const isTablePatch = (candidate: unknown): candidate is TablePatch => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>

  if (Object.keys(obj).join(', ') !== 'data') return false
  const { type, attributes, relationships } = obj.data as Record<string, unknown>

  if (type !== 'tables') return false
  if (!isTableAttributesPartial(attributes)) return false
  if (!hasNoOtherProperties(obj.data as Record<string, unknown>, ['type', 'id', 'attributes', 'relationships'])) return false
  return relationships === undefined || isUserRelationship((relationships as Record<string, unknown>).authors)
}

export {
  createTablePatch,
  isTablePatch
}
