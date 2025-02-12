import { type ScaleAttributesKeys, scaleAttributes } from './scale-attributes.ts'
import { type ScrollAttributesKeys, scrollAttributes } from './scroll-attributes.ts'
import { type TableAttributesKeys, tableAttributes } from './table-attributes.ts'
import { type UserAttributesKeys, userAttributes } from './user-attributes.ts'

export default interface Fields {
  scales: readonly ScaleAttributesKeys[]
  scrolls: readonly ScrollAttributesKeys[]
  tables: readonly TableAttributesKeys[]
  users: readonly UserAttributesKeys[]
}

const createFields = (overrides?: Partial<Fields>): Fields => {
  const defaultFields: Fields = {
    scales: scaleAttributes,
    scrolls: scrollAttributes,
    tables: tableAttributes,
    users: userAttributes
  }

  return { ...defaultFields, ...overrides }
}

export { createFields }
