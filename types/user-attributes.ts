import isObject from '../utils/guards/object.ts'
import isStringOrUndefined from '../utils/guards/string.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface UserAttributes {
  name?: string
  username?: string
}

const userAttributes = ['name', 'username'] as const
type UserAttributesKeys = (typeof userAttributes)[number]

const createUserAttributes = (overrides?: Partial<UserAttributes>): UserAttributes => {
  const defaultUserAttributes: UserAttributes = {
    name: 'John Doe',
    username: 'john'
  }

  return { ...defaultUserAttributes, ...overrides }
}

// deno-lint-ignore no-explicit-any
const isUserAttributes = (candidate: any): candidate is UserAttributes => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>
  const strings = ['name', 'username']
  if (!hasNoOtherProperties(obj, strings)) return false
  return strings.every(key => isStringOrUndefined(obj[key]))
}

export {
  createUserAttributes,
  isUserAttributes,
  userAttributes,
  type UserAttributesKeys
}
