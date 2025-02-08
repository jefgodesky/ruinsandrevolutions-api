import type Item from './item.ts'
import ScaleAttributes, { createScaleAttributes, isScaleAttributesPartial } from './scale-attributes.ts'
import { createUser } from './user.ts'
import isObject from '../utils/guards/object.ts'
import isStringOrUndefined from '../utils/guards/string.ts'
import isUserArray from '../utils/guards/user-array.ts'
import hasAllProperties from '../utils/has-all-properties.ts'

export default interface Scale extends Item, ScaleAttributes {}

const createScale = (overrides?: Partial<Scale>): Scale => {
  const attributes = createScaleAttributes(overrides)
  return {
    id: overrides?.id ?? crypto.randomUUID(),
    ...attributes,
    authors: overrides?.authors ?? [createUser()]
  }
}

const isScalePartial = (candidate: unknown): candidate is Partial<Scale> => {
  if (!isObject(candidate)) return false
  const { id, authors, ...attributes } = candidate as Record<string, unknown>
  if (!isScaleAttributesPartial(attributes)) return false
  if (!isStringOrUndefined(id)) return false
  return authors === undefined || isUserArray(authors)
}

const isScale = (candidate: unknown): candidate is Scale => {
  if (!isScalePartial(candidate)) return false
  return hasAllProperties(candidate, ['id', 'name', 'levels', 'authors'])
}

export {
  createScale,
  isScale,
  isScalePartial
}
