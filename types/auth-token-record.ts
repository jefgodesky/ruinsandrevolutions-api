import type Model from './model.ts'
import getTokenExpiration from '../utils/get-token-expiration.ts'
import getRefreshExpiration from '../utils/get-refresh-expiration.ts'

export default interface AuthTokenRecord extends Model {
  uid: string
  refresh: string
  token_expiration: Date
  refresh_expiration: Date
}

const createAuthTokenRecord = (overrides?: Partial<AuthTokenRecord>): AuthTokenRecord => {
  const defaultAuthTokenRecord: AuthTokenRecord = {
    id: crypto.randomUUID(),
    uid: crypto.randomUUID(),
    refresh: 'test-refresh-token',
    token_expiration: getTokenExpiration(),
    refresh_expiration: getRefreshExpiration()
  }

  return { ...defaultAuthTokenRecord, ...overrides }
}

export { createAuthTokenRecord }
