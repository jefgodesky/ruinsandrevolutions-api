import ScrollAttributes, { createScrollAttributes, isScrollAttributes } from './scroll-attributes.ts'
import UserRelationship, { isUserRelationship } from './user-relationship.ts'
import User, { isUser } from './user.ts'
import isObject from '../utils/guards/object.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface ScrollCreation {
  data: {
    type: 'scrolls'
    attributes: ScrollAttributes
    relationships?: {
      authors?: UserRelationship
    }
  }
}

const createScrollCreation = (
  overrides?: Partial<ScrollAttributes>,
  authors: (User | string)[] = [crypto.randomUUID()]
): ScrollCreation => {
  const attributes = createScrollAttributes(overrides)
  delete attributes.created
  delete attributes.updated

  return {
    data: {
      type: 'scrolls',
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

const isScrollCreation = (candidate: unknown): candidate is ScrollCreation => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>

  if (Object.keys(obj).join(', ') !== 'data') return false
  const { type, attributes, relationships } = obj.data as Record<string, unknown>

  if (type !== 'scrolls') return false
  if (!isScrollAttributes(attributes)) return false
  if (!hasNoOtherProperties(obj.data as Record<string, unknown>, ['type', 'id', 'attributes', 'relationships'])) return false
  return relationships === undefined || isUserRelationship((relationships as Record<string, unknown>).authors)
}

export {
  createScrollCreation,
  isScrollCreation
}
