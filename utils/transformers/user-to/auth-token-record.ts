import type AuthTokenRecord from '../../../types/auth-token-record.ts'
import type User from '../../../types/user.ts'
import getTokenExpiration from '../../get-token-expiration.ts'
import getRefreshExpiration from '../../get-refresh-expiration.ts'

const userToAuthTokenRecord = (user: User): AuthTokenRecord => {
  return {
    uid: user.id ?? '',
    refresh: crypto.randomUUID(),
    token_expiration: getTokenExpiration(),
    refresh_expiration: getRefreshExpiration()
  }
}

export default userToAuthTokenRecord

