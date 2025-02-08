import type Account from '../../types/account.ts'
import type AuthToken from '../../types/auth-token.ts'
import type AuthTokenRecord from '../../types/auth-token-record.ts'
import type Provider from '../../types/provider.ts'
import type User from '../../types/user.ts'
import { PROVIDERS } from '../../types/provider.ts'
import AuthTokenController from '../../collections/auth/tokens/controller.ts'
import getTokenExpiration from '../get-token-expiration.ts'
import getRefreshExpiration from '../get-refresh-expiration.ts'
import authTokenRecordToAuthToken from '../transformers/auth-token-record-to/auth-token.ts'
import authTokenToJWT from '../transformers/auth-token-to/jwt.ts'
import UserRepository from '../../collections/users/repository.ts'

type TestSetupUserOptions = {
  name?: string
  username?: string
  provider?: Provider
  createAccount?: boolean
  createToken?: boolean
}

const getNameUsername = (index: number): { name: string, username: string } => {
  const usernames = ['Alice', 'Bob', 'Charlie', 'Debbie', 'Earl', 'Frank', 'Giuli', 'Heather', 'Idris', 'Jason']
  return {
    name: usernames[index],
    username: usernames[index].toLowerCase()
  }
}

const findNameUsername = async (users: UserRepository): Promise<{ name: string, username: string }> => {
  let index = 0
  let { name, username } = getNameUsername(index)
  let clearName = false
  while (!clearName && index < 10) {
    const check = await users.getByUsername(username)
    clearName = check === null
    if (check !== null) {
      index++
      const data = getNameUsername(index)
      name = data.name
      username = data.username
    }
  }

  if (!clearName) {
    name = crypto.randomUUID()
    username = name
  }

  return { name, username }
}

const setupUser = async({
  provider = PROVIDERS.GOOGLE,
  createAccount = true,
  createToken = true
}: TestSetupUserOptions = {}): Promise<{
  user: User,
  account?: Account,
  token?: AuthToken
  jwt?: string
}> => {
  const { users, accounts, tokens } = AuthTokenController.getRepositories()
  const { name, username } = await findNameUsername(users)
  const data: { user: User, account?: Account, token?: AuthToken, jwt?: string } = {
    user: await users.save({ name, username }) as User
  }

  if (createAccount) {
    data.account = await accounts.save({
      uid: data.user.id ?? '',
      provider,
      pid: '1'
    }) as Account
  }

  if (createToken) {
    const record = await tokens.save({
      uid: data.user.id ?? '',
      refresh: crypto.randomUUID(),
      token_expiration: getTokenExpiration(),
      refresh_expiration: getRefreshExpiration()
    }) as AuthTokenRecord
    const token = await authTokenRecordToAuthToken(record)

    if (token) {
      data.token = token
      data.jwt = await authTokenToJWT(token)
    }
  }

  return data
}

export default setupUser
