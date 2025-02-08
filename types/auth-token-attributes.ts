import isObject from '../utils/guards/object.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface AuthTokenAttributes {
  token: string
  expiration: string
}

const isAuthTokenAttributes = (candidate: unknown): candidate is AuthTokenAttributes => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>

  const fields = ['token', 'expiration']
  if (!fields.every(key => typeof obj[key] === 'string')) return false
  return hasNoOtherProperties(obj, fields)
}

export { isAuthTokenAttributes }
