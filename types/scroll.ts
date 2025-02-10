import type Item from './item.ts'
import ScrollAttributes, { createScrollAttributes, isScrollAttributesPartial } from './scroll-attributes.ts'
import { createUser } from './user.ts'
import isObject from '../utils/guards/object.ts'
import isStringOrUndefined from '../utils/guards/string.ts'
import isUserArray from '../utils/guards/user-array.ts'
import hasAllProperties from '../utils/has-all-properties.ts'

export default interface Scroll extends Item, ScrollAttributes {}

const createScroll = (overrides?: Partial<Scroll>): Scroll => {
  const attributes = createScrollAttributes(overrides)
  return {
    id: overrides?.id ?? crypto.randomUUID(),
    ...attributes,
    authors: overrides?.authors ?? [createUser()]
  }
}

const isScrollPartial = (candidate: unknown): candidate is Partial<Scroll> => {
  if (!isObject(candidate)) return false
  const { id, authors, ...attributes } = candidate as Record<string, unknown>
  if (!isScrollAttributesPartial(attributes)) return false
  if (!isStringOrUndefined(id)) return false
  return authors === undefined || isUserArray(authors)
}

const isScroll = (candidate: unknown): candidate is Scroll => {
  if (!isScrollPartial(candidate)) return false
  return hasAllProperties(candidate, ['id', 'name', 'start', 'authors'])
}

export {
  createScroll,
  isScroll,
  isScrollPartial
}
