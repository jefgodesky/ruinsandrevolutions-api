import type BaseResource from './base-resource.ts'
import type Table from './table.ts'
import TableAttributes, { createTableAttributes, isTableAttributesPartial } from './table-attributes.ts'
import UserRelationship, { isUserRelationship } from './user-relationship.ts'
import { isLinks } from './links.ts'
import isObject from '../utils/guards/object.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface TableResource extends BaseResource {
  type: 'tables'
  attributes?: Partial<TableAttributes>
  relationships?: {
    authors?: UserRelationship
  }
}

const createTableResource = (overrides?: Partial<Table>): TableResource => {
  const id = overrides?.id ?? crypto.randomUUID()
  const resource: TableResource = {
    type: 'tables',
    id,
    attributes: createTableAttributes(overrides)
  }

  if (overrides?.authors) {
    resource.relationships = {
      authors: {
        data: overrides.authors.map(a => ({ type: 'users', id: a.id ?? 'ERROR' }))
      }
    }
  }

  return resource
}

const isTableResource = (candidate: unknown): candidate is TableResource => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>
  if (obj.type !== 'tables') return false
  if (typeof obj.id !== 'string') return false
  if (obj.links !== undefined && !isLinks(obj.links)) return false
  if (obj.attributes !== undefined && !isTableAttributesPartial(obj.attributes)) return false
  if (!hasNoOtherProperties(obj, ['type', 'id', 'links', 'attributes', 'relationships'])) return false
  if (obj.relationships === undefined) return true

  const rel = obj.relationships as Record<string, unknown>
  if (!isObject(rel)) return false
  if (Object.keys(rel).length === 0) return true
  if (!hasNoOtherProperties(rel, ['authors'])) return false
  return isUserRelationship((rel as Record<string, unknown>).authors)
}

export {
  createTableResource,
  isTableResource
}
