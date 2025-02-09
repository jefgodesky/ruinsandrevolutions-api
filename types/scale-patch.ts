import * as uuid from '@std/uuid'
import ScaleAttributes, { createScaleAttributes, isScaleAttributesPartial } from './scale-attributes.ts'
import isObject from '../utils/guards/object.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface ScalePatch {
  data: {
    type: 'scales'
    id: string
    attributes: Partial<ScaleAttributes>
  }
}

const createScalePatch = (
  overrides?: Partial<ScaleAttributes>,
  id: string = crypto.randomUUID()
): ScalePatch => {
  const attributes = createScaleAttributes(overrides)
  delete attributes.created
  delete attributes.updated

  return {
    data: {
      type: 'scales',
      id,
      attributes
    }
  }
}

const isScalePatch = (candidate: unknown): candidate is ScalePatch => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>

  if (Object.keys(obj).join(', ') !== 'data') return false
  const { type, id, attributes } = obj.data as Record<string, unknown>

  if (type !== 'scales') return false
  if (!uuid.v4.validate((id ?? 'ERROR').toString())) return false
  if (!isScaleAttributesPartial(attributes)) return false
  return hasNoOtherProperties(obj.data as Record<string, unknown>, ['type', 'id', 'attributes', 'relationships'])
}

export {
  createScalePatch,
  isScalePatch
}
