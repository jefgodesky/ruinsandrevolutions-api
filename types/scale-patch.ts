import * as uuid from '@std/uuid'
import ScaleAttributes, { createScaleAttributes, isScaleAttributesPartial } from './scale-attributes.ts'
import UserRelationship, { isUserRelationship } from './user-relationship.ts'
import User, { isUser } from './user.ts'
import isObject from '../utils/guards/object.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface ScalePatch {
  data: {
    type: 'scales'
    id: string
    attributes: Partial<ScaleAttributes>
    relationships?: {
      authors?: UserRelationship
    }
  }
}

const createScalePatch = (
  overrides?: Partial<ScaleAttributes>,
  id: string = crypto.randomUUID(),
  authors: (User | string)[] = [crypto.randomUUID()]
): ScalePatch => {
  const attributes = createScaleAttributes(overrides)
  delete attributes.created
  delete attributes.updated

  return {
    data: {
      type: 'scales',
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

const isScalePatch = (candidate: unknown): candidate is ScalePatch => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>

  if (Object.keys(obj).join(', ') !== 'data') return false
  const { type, id, attributes, relationships } = obj.data as Record<string, unknown>

  if (type !== 'scales') return false
  if (!uuid.v4.validate((id ?? 'ERROR').toString())) return false
  if (!isScaleAttributesPartial(attributes)) return false
  if (!hasNoOtherProperties(obj.data as Record<string, unknown>, ['type', 'id', 'attributes', 'relationships'])) return false
  return relationships === undefined || isUserRelationship((relationships as Record<string, unknown>).authors)
}

export {
  createScalePatch,
  isScalePatch
}
