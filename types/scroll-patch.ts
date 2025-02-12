import * as uuid from '@std/uuid'
import ScrollAttributes, { createScrollAttributes, isScrollAttributesPartial } from './scroll-attributes.ts'
import UserRelationship, { isUserRelationship } from './user-relationship.ts'
import User, { isUser } from './user.ts'
import isObject from '../utils/guards/object.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface ScrollPatch {
  data: {
    type: 'scrolls'
    id: string
    attributes: Partial<ScrollAttributes>
    relationships?: {
      authors?: UserRelationship
    }
  }
}

const createScrollPatch = (
  overrides?: Partial<ScrollAttributes>,
  id: string = crypto.randomUUID(),
  authors: (User | string)[] = [crypto.randomUUID()]
): ScrollPatch => {
  const attributes = createScrollAttributes(overrides)
  delete attributes.created
  delete attributes.updated

  return {
    data: {
      type: 'scrolls',
      id,
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

const isScrollPatch = (candidate: unknown): candidate is ScrollPatch => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>

  if (Object.keys(obj).join(', ') !== 'data') return false
  const { type, id, attributes, relationships } = obj.data as Record<string, unknown>

  if (type !== 'scrolls') return false
  if (!uuid.v4.validate((id ?? 'ERROR').toString())) return false
  if (!isScrollAttributesPartial(attributes)) return false
  if (!hasNoOtherProperties(obj.data as Record<string, unknown>, ['type', 'id', 'attributes', 'relationships'])) return false
  return relationships === undefined || isUserRelationship((relationships as Record<string, unknown>).authors)
}

export {
  createScrollPatch,
  isScrollPatch
}
