import ScaleAttributes, { createScaleAttributes, isScaleAttributes } from './scale-attributes.ts'
import UserRelationship, { isUserRelationship } from './user-relationship.ts'
import User, { isUser } from './user.ts'
import isObject from '../utils/guards/object.ts'

export default interface ScaleCreation {
  data: {
    type: 'scales'
    attributes: ScaleAttributes
    relationships?: {
      authors?: UserRelationship
    }
  }
}

const createScaleCreation = (
  overrides?: Partial<ScaleAttributes>,
  authors: (User | string)[] = [crypto.randomUUID()]
): ScaleCreation => {
  const attributes = createScaleAttributes(overrides)
  delete attributes.created
  delete attributes.updated

  return {
    data: {
      type: 'scales',
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

const isScaleCreation = (candidate: unknown): candidate is ScaleCreation => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>

  if (Object.keys(obj).join(', ') !== 'data') return false
  const { type, attributes, relationships } = obj.data as Record<string, unknown>

  if (type !== 'scales') return false
  if (!isScaleAttributes(attributes)) return false
  return relationships === undefined || isUserRelationship((relationships as Record<string, unknown>).authors)
}

export {
  createScaleCreation,
  isScaleCreation
}
