import { hash } from '@stdext/crypto/hash'
import type AuthToken from '../../../types/auth-token.ts'
import type AuthTokenRecord from '../../../types/auth-token-record.ts'
import UserRepository from '../../../collections/users/repository.ts'
import addRoles from '../../add-roles.ts'

const authTokenRecordToAuthToken = async (record: AuthTokenRecord): Promise<AuthToken | null> => {
  const users = new UserRepository()
  const user = await users.get(record.uid)
  if (!user) return null

  const refresh = hash('argon2', record.refresh)
  return {
    id: record.id,
    user: await addRoles(user),
    refresh,
    expiration: {
      token: record.token_expiration,
      refresh: record.refresh_expiration
    }
  }
}

export default authTokenRecordToAuthToken
