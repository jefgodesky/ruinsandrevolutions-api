import { type ScaleAttributesKeys, scaleAttributes } from './scale-attributes.ts'
import { type UserAttributesKeys, userAttributes } from './user-attributes.ts'

export default interface Fields {
  scales: readonly ScaleAttributesKeys[]
  users: readonly UserAttributesKeys[]
}

const createFields = (overrides?: Partial<Fields>): Fields => {
  const defaultFields: Fields = {
    scales: scaleAttributes,
    users: userAttributes
  }

  return { ...defaultFields, ...overrides }
}

export { createFields }
