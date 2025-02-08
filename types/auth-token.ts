import type Model from './model.ts'
import User, { createUser } from './user.ts'
import getRefreshExpiration from '../utils/get-refresh-expiration.ts'
import getTokenExpiration from '../utils/get-token-expiration.ts'

export default interface AuthToken extends Model {
  user: User
  refresh: string
  expiration: {
    token: Date
    refresh: Date
  }
}

const createAuthToken = (overrides?: Partial<AuthToken>): AuthToken => {
  const defaultExpiration = {
    token: getTokenExpiration(),
    refresh: getRefreshExpiration()
  }

  const defaultAuthToken: AuthToken = {
    id: crypto.randomUUID(),
    user: createUser(overrides?.user),
    refresh: 'refresh-string',
    expiration: { ...defaultExpiration, ...overrides?.expiration }
  }

  return { ...defaultAuthToken, ...overrides }
}

export { createAuthToken }
