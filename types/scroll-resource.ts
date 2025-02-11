import type BaseResource from './base-resource.ts'
import type Scroll from './scroll.ts'
import ScrollAttributes, { createScrollAttributes, isScrollAttributesPartial } from './scroll-attributes.ts'
import UserRelationship, { isUserRelationship } from './user-relationship.ts'
import { isLinks } from './links.ts'
import isObject from '../utils/guards/object.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface ScrollResource extends BaseResource {
  type: 'scrolls'
  attributes?: Partial<ScrollAttributes>
  relationships?: {
    authors?: UserRelationship
  }
}

const createScrollResource = (overrides?: Partial<Scroll>): ScrollResource => {
  const id = overrides?.id ?? crypto.randomUUID()
  const resource: ScrollResource = {
    type: 'scrolls',
    id,
    attributes: createScrollAttributes(overrides)
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

const isScrollResource = (candidate: unknown): candidate is ScrollResource => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>
  if (obj.type !== 'scrolls') return false
  if (typeof obj.id !== 'string') return false
  if (obj.links !== undefined && !isLinks(obj.links)) return false
  if (obj.attributes !== undefined && !isScrollAttributesPartial(obj.attributes)) return false
  if (!hasNoOtherProperties(obj, ['type', 'id', 'links', 'attributes', 'relationships'])) return false
  if (obj.relationships === undefined) return true

  const rel = obj.relationships as Record<string, unknown>
  if (!isObject(rel)) return false
  if (Object.keys(rel).length === 0) return true
  if (!hasNoOtherProperties(rel, ['authors'])) return false
  return isUserRelationship((rel as Record<string, unknown>).authors)
}

export {
  createScrollResource,
  isScrollResource
}
