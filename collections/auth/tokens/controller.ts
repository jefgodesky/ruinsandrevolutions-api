import type Account from '../../../types/account.ts'
import type AuthToken from '../../../types/auth-token.ts'
import type AuthTokenRecord from '../../../types/auth-token-record.ts'
import type ProviderID from '../../../types/provider-id.ts'
import type Provider from '../../../types/provider.ts'
import type Response from '../../../types/response.ts'
import AuthTokenRepository from './repository.ts'
import AccountRepository from '../../accounts/repository.ts'
import UserRepository from '../../users/repository.ts'
import userToAuthTokenRecord from '../../../utils/transformers/user-to/auth-token-record.ts'
import userProviderIdToAccount from '../../../utils/transformers/user-provider-id-to/account.ts'
import authTokenRecordToAuthToken from '../../../utils/transformers/auth-token-record-to/auth-token.ts'
import authTokenToResponse from '../../../utils/transformers/auth-token-to/response.ts'
import isTest from '../../../utils/testing/is-test.ts'
import jwtToAuthTokenRecord from '../../../utils/transformers/jwt-to/auth-token-record.ts'
import verifyOAuthToken from '../../../utils/auth/verify-oauth.ts'

class AuthTokenController {
  private static tokens: AuthTokenRepository
  private static users: UserRepository
  private static accounts: AccountRepository

  constructor () {
    AuthTokenController.getRepositories()
  }

  static getRepositories (): {
    tokens: AuthTokenRepository,
    users: UserRepository,
    accounts: AccountRepository
  } {
    if (!AuthTokenController.tokens) AuthTokenController.tokens = new AuthTokenRepository()
    if (!AuthTokenController.users) AuthTokenController.users = new UserRepository()
    if (!AuthTokenController.accounts) AuthTokenController.accounts = new AccountRepository()

    return {
      tokens: AuthTokenController.tokens,
      users: AuthTokenController.users,
      accounts: AuthTokenController.accounts
    }
  }

  static async create (provider: Provider, token: string, override?: ProviderID): Promise<Response | null> {
    const { tokens, users, accounts } = AuthTokenController.getRepositories()
    let verification = await verifyOAuthToken(provider, token)
    if (verification === false && isTest() && override) verification = override
    if (!verification) return null

    const { pid, name } = verification
    const existing = await accounts.getByProviderAndProviderID(provider, pid)

    const user = existing
      ? await users.get(existing.uid)
      : await users.save({ name })

    if (!user) return null
    const acct: Account = existing ?? userProviderIdToAccount(user, verification)
    if (!existing) await accounts.save(acct)

    let record: AuthTokenRecord = userToAuthTokenRecord(user)
    const saved = await tokens.save(record)
    if (saved) record = saved

    const t: AuthToken | null = await authTokenRecordToAuthToken(record)
    if (!t) return null
    return authTokenToResponse(t)
  }

  static async refresh (jwt: string): Promise<Response | null> {
    const record = await jwtToAuthTokenRecord(jwt)
    if (!record) return null
    if (record.refresh_expiration.getTime() < Date.now()) return null

    const { tokens } = AuthTokenController.getRepositories()
    const newRecord = await tokens.exchange(record)
    const newToken = newRecord ? await authTokenRecordToAuthToken(newRecord) : null
    if (!newToken) return null
    return authTokenToResponse(newToken)
  }
}

export default AuthTokenController
