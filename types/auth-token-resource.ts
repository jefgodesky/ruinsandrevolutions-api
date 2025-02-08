import type BaseResource from './base-resource.ts'
import AuthTokenAttributes, { isAuthTokenAttributes } from './auth-token-attributes.ts'
import { isLinks } from './links.ts'
import isObject from '../utils/guards/object.ts'
import isStringOrUndefined from '../utils/guards/string.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface AuthTokenResource extends BaseResource {
  type: 'token'
  attributes: AuthTokenAttributes
}

const isAuthTokenResource = (candidate: unknown): candidate is AuthTokenResource => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>

  if (obj.type !== 'token') return false
  if (obj.links !== undefined && !isLinks(obj.links)) return false
  if (!isAuthTokenAttributes(obj.attributes)) return false
  if (!isStringOrUndefined(obj.id)) return false
  return hasNoOtherProperties(obj, ['id', 'links', 'type', 'attributes'])
}

export { isAuthTokenResource }
