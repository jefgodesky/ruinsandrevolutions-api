import { validateJWT } from '@cross/jwt'
import type AuthTokenRecord from '../../../types/auth-token-record.ts'
import getJWTSecret from '../../get-jwt-secret.ts'

const jwtToAuthTokenRecord = async (jwt: string): Promise<AuthTokenRecord | null> => {
  try {
    const payload = await validateJWT(jwt, getJWTSecret())
    const required = [payload.id, payload.user?.id, payload.refresh,
      payload.expiration?.token, payload.expiration?.refresh]
    if (!required.every(item => item !== undefined)) return null

    return {
      id: payload.id,
      uid: payload.user.id,
      refresh: payload.refresh,
      token_expiration: new Date(payload.expiration.token),
      refresh_expiration: new Date(payload.expiration.refresh)
    }
  } catch {
    return null
  }
}

export default jwtToAuthTokenRecord
