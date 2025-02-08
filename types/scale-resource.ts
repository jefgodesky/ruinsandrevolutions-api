import type BaseResource from './base-resource.ts'
import type Scale from './scale.ts'
import ScaleAttributes, { createScaleAttributes, isScaleAttributesPartial } from './scale-attributes.ts'
import UserRelationship, {isUserRelationship} from './user-relationship.ts'
import getRoot from '../utils/get-root.ts'
import { isLinks } from './links.ts'
import isObject from '../utils/guards/object.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface ScaleResource extends BaseResource {
  type: 'scales'
  attributes?: Partial<ScaleAttributes>
  relationships?: {
    authors?: UserRelationship
  }
}

const createScaleResource = (overrides?: Partial<Scale>): ScaleResource => {
  const id = overrides?.id ?? crypto.randomUUID()
  const resource: ScaleResource = {
    type: 'scales',
    id,
    attributes: createScaleAttributes(overrides)
  }

  if (overrides?.authors) {
    resource.relationships = {
      authors: {
        links: {
          self: `${getRoot()}/scales/${id}/relationships/authors`
        },
        data: overrides.authors.map(a => ({ type: 'users', id: a.id ?? 'ERROR' }))
      }
    }
  }

  return resource
}

const isScaleResource = (candidate: unknown): candidate is ScaleResource => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>
  if (obj.type !== 'scales') return false
  if (typeof obj.id !== 'string') return false
  if (obj.links !== undefined && !isLinks(obj.links)) return false
  if (obj.attributes !== undefined && !isScaleAttributesPartial(obj.attributes)) return false
  if (!hasNoOtherProperties(obj, ['type', 'id', 'links', 'attributes', 'relationships'])) return false
  if (obj.relationships === undefined) return true

  const rel = obj.relationships as Record<string, unknown>
  if (!isObject(rel)) return false
  if (Object.keys(rel).length === 0) return true
  if (!hasNoOtherProperties(rel, ['authors'])) return false
  return isUserRelationship((rel as Record<string, unknown>).authors)
}

export {
  createScaleResource,
  isScaleResource
}
