import type AuthToken from '../../../types/auth-token.ts'
import type Response from '../../../types/response.ts'
import type AuthTokenResource from '../../../types/auth-token-resource.ts'
import getJSONAPI from '../../get-jsonapi.ts'
import getRoot from '../../get-root.ts'
import authTokenToJWT from './jwt.ts'

const authTokenToResponse = async (token: AuthToken): Promise<Response> => {
  const jwt = await authTokenToJWT(token)
  const data: AuthTokenResource = {
    type: 'token',
    id: token.id ?? '',
    attributes: {
      token: jwt,
      expiration: token.expiration.token.toString()
    }
  }

  return {
    jsonapi: getJSONAPI(),
    links: {
      self: getRoot() + '/auth/token',
      describedBy: getRoot() + '/docs'
    },
    data
  }
}

export default authTokenToResponse
