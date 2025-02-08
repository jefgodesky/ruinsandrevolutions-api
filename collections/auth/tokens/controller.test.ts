import { describe, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import { validateJWT, type JWTPayload } from '@cross/jwt'
import type AuthTokenResource from '../../../types/auth-token-resource.ts'
import type Response from '../../../types/response.ts'
import type User from '../../../types/user.ts'
import { PROVIDERS } from '../../../types/provider.ts'
import ProviderID, { createProviderID } from '../../../types/provider-id.ts'
import DB from '../../../DB.ts'
import AuthTokenController from './controller.ts'
import RoleRepository from '../../users/roles/repository.ts'
import authTokenToJWT from '../../../utils/transformers/auth-token-to/jwt.ts'
import getJWTSecret from '../../../utils/get-jwt-secret.ts'
import setupUser from '../../../utils/testing/setup-user.ts'
import expectAuthTokenJWT from '../../../utils/testing/expect-auth-token-jwt.ts'
import expectUsersAccountsTokens from '../../../utils/testing/expect-users-accounts-tokens.ts'

describe('AuthTokenController', () => {
  afterEach(DB.clear)
  afterAll(DB.close)

  describe('create', () => {
    const secret = Deno.env.get('JWT_SECRET') ?? ''

    const expectToken = async (res: Response | null, mock: ProviderID): Promise<void> => {
      const { payload, user } = await getPayloadAndUser(res!)
      expect(res).not.toBeNull()
      expect(payload.user.name).toBe(mock.name)
      expect(user?.name).toBe(mock.name)
    }

    const getPayloadAndUser = async (res: Response): Promise<{ payload: JWTPayload, user: User | null}> => {
      const { users } = AuthTokenController.getRepositories()
      const jwt = (res?.data as AuthTokenResource)?.attributes.token ?? ''
      const payload = await validateJWT(jwt, secret)
      const user = await users.get(payload.user.id)
      return { payload, user }
    }

    it('returns null if not given a valid Google ID token', async () => {
      const res = await AuthTokenController.create(PROVIDERS.GOOGLE, 'test')
      expect(res).toBeNull()
    })

    it('returns a new user and a token if given a valid Google ID token', async () => {
      const mock = createProviderID()
      const res = await AuthTokenController.create(mock.provider, 'test', mock)
      await expectToken(res, mock)
    })

    it('returns a new token if given a valid Google ID token for an existing account', async () => {
      const mock = createProviderID()
      await AuthTokenController.create(mock.provider, 'test', mock)
      const res = await AuthTokenController.create(mock.provider, 'test', mock)
      await expectToken(res, mock)
      await expectUsersAccountsTokens({ users: 1, accounts: 1, tokens: 2 })
    })

    it('returns null if not given a valid Discord ID token', async () => {
      const res = await AuthTokenController.create(PROVIDERS.DISCORD, 'test')
      expect(res).toBeNull()
    })

    it('returns a new user and a token if given a valid Discord access token', async () => {
      const mock = createProviderID({ provider: PROVIDERS.DISCORD })
      const res = await AuthTokenController.create(mock.provider, 'test', mock)
      await expectToken(res, mock)
    })

    it('returns a new token if given a valid Discord ID token for an existing account', async () => {
      const mock = createProviderID({ provider: PROVIDERS.DISCORD })
      await AuthTokenController.create(mock.provider, 'test', mock)
      const res = await AuthTokenController.create(mock.provider, 'test', mock)
      await expectToken(res, mock)
      await expectUsersAccountsTokens({ users: 1, accounts: 1, tokens: 2 })
    })

    it('returns null if not given a valid GitHub ID token', async () => {
      const res = await AuthTokenController.create(PROVIDERS.GITHUB, 'test')
      expect(res).toBeNull()
    })

    it('returns a new user and a token if given a valid GITHUB access token', async () => {
      const mock = createProviderID({ provider: PROVIDERS.GITHUB })
      const res = await AuthTokenController.create(mock.provider, 'test', mock)
      await expectToken(res, mock)
    })

    it('returns a new token if given a valid GitHub ID token for an existing account', async () => {
      const mock = createProviderID({ provider: PROVIDERS.GITHUB })
      await AuthTokenController.create(mock.provider, 'test', mock)
      const res = await AuthTokenController.create(mock.provider, 'test', mock)
      await expectToken(res, mock)
      await expectUsersAccountsTokens({ users: 1, accounts: 1, tokens: 2 })
    })
  })

  describe('refresh', () => {
    it('returns null if given an invalid token', async () => {
      const res = await AuthTokenController.refresh('nope')
      expect(res).toBeNull()
    })

    it('returns null if the refresh expiration has expired', async () => {
      const { token} = await setupUser()
      token!.expiration.refresh = new Date(Date.now() - (5 * 60 * 1000))
      const jwt = await authTokenToJWT(token!)
      const res = await AuthTokenController.refresh(jwt)
      expect(res).toBeNull()
    })

    it('returns null if the user has been deactivated', async () => {
      const roles = new RoleRepository()
      const { user, token } = await setupUser()
      const jwt = await authTokenToJWT(token!)
      await roles.revoke(user.id!, 'active')
      const res = await AuthTokenController.refresh(jwt)
      expect(res).toBeNull()
    })

    it('refreshes the token', async () => {
      const { user, token } = await setupUser()
      const jwt = await authTokenToJWT(token!)
      const res = await AuthTokenController.refresh(jwt)
      const actualJWT = (res?.data as AuthTokenResource)?.attributes.token ?? ''

      try {
        const payload = await validateJWT(actualJWT, getJWTSecret(), { validateExp: true })
        expectAuthTokenJWT(payload, user)
      } catch (err) {
        expect(err).not.toBeDefined()
      }
    })
  })
})
