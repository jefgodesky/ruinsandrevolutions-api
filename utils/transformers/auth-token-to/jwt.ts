import { signJWT } from '@cross/jwt'
import type AuthToken from '../../../types/auth-token.ts'
import getJWTSecret from '../../get-jwt-secret.ts'

const authTokenToJWT = async (token: AuthToken): Promise<string> => {
  return await signJWT({
    ...token,
    sub: token.user.id,
    exp: Math.floor(token.expiration.token.getTime() / 1000)
  }, getJWTSecret(), { setIat: true })
}

export default authTokenToJWT
