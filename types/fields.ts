import { type UserAttributesKeys, userAttributes } from './user-attributes.ts'

export default interface Fields {
  users: readonly UserAttributesKeys[]
}

const createFields = (overrides?: Partial<Fields>): Fields => {
  const defaultFields: Fields = {
    users: userAttributes
  }

  return { ...defaultFields, ...overrides }
}

export { createFields }
