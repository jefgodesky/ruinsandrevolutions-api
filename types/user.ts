import type Model from './model.ts'
import isObject from '../utils/guards/object.ts'
import isStringOrUndefined from '../utils/guards/string.ts'
import isStringArray from '../utils/guards/string-array.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface User extends Model {
  name: string
  username?: string
  roles?: string[]
}

const createUser = (overrides?: Partial<User>): User => {
  const defaultUser: User = {
    id: crypto.randomUUID(),
    name: 'John Doe',
    username: 'john',
    roles: ['active', 'listed']
  }

  return { ...defaultUser, ...overrides }
}

const isUser = (candidate: unknown): candidate is User => {
  if (!isObject(candidate)) return false

  const obj = candidate as Record<string, unknown>
  if (typeof obj.name !== 'string') return false

  if (!hasNoOtherProperties(obj, ['id', 'name', 'username', 'roles'])) return false
  if (!isStringOrUndefined(obj.username)) return false
  return obj.roles === undefined || isStringArray(obj.roles)
}

export {
  createUser,
  isUser
}
