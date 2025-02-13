import type Item from './item.ts'
import TableAttributes, { createTableAttributes, isTableAttributesPartial } from './table-attributes.ts'
import { createUser } from './user.ts'
import isObject from '../utils/guards/object.ts'
import isStringOrUndefined from '../utils/guards/string.ts'
import isUserArray from '../utils/guards/user-array.ts'
import hasAllProperties from '../utils/has-all-properties.ts'

export default interface Table extends Item, TableAttributes {}

const createTable = (overrides?: Partial<Table>): Table => {
  const attributes = createTableAttributes(overrides)
  return {
    id: overrides?.id ?? crypto.randomUUID(),
    ...attributes,
    authors: overrides?.authors ?? [createUser()]
  }
}

const isTablePartial = (candidate: unknown): candidate is Partial<Table> => {
  if (!isObject(candidate)) return false
  const { id, authors, ...attributes } = candidate as Record<string, unknown>
  if (!isTableAttributesPartial(attributes)) return false
  if (!isStringOrUndefined(id)) return false
  return authors === undefined || isUserArray(authors)
}

const isTable = (candidate: unknown): candidate is Table => {
  if (!isTablePartial(candidate)) return false
  return hasAllProperties(candidate, ['id', 'name', 'methods', 'rows', 'authors'])
}

export {
  createTable,
  isTable,
  isTablePartial
}
