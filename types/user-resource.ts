import type BaseResource from './base-resource.ts'
import UserAttributes, { createUserAttributes, isUserAttributes } from './user-attributes.ts'
import { isLinks } from './links.ts'
import isObject from '../utils/guards/object.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface UserResource extends BaseResource {
  type: 'users'
  attributes?: UserAttributes
}

const createUserResource = (overrides?: Partial<UserResource>): UserResource => {
  const defaultUserResource: UserResource = {
    type: 'users',
    id: crypto.randomUUID(),
    attributes: createUserAttributes(overrides?.attributes)
  }

  return { ...defaultUserResource, ...overrides }
}

const isUserResource = (candidate: unknown): candidate is UserResource => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>
  if (obj.type !== 'users') return false
  if (typeof obj.id !== 'string') return false
  if (obj.links !== undefined && !isLinks(obj.links)) return false
  if (obj.attributes !== undefined && !isUserAttributes(obj.attributes)) return false
  return hasNoOtherProperties(obj, ['type', 'id', 'links', 'attributes'])
}

export {
  createUserResource,
  isUserResource
}
