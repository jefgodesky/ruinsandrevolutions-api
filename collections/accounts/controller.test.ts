import { describe, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import { Context, HttpError, Status } from '@oak/oak'
import { createMockContext } from '@oak/oak/testing'
import type Provider from '../../types/provider.ts'
import type ProviderID from '../../types/provider-id.ts'
import type ProviderResource from '../../types/provider-resource.ts'
import type Resource from '../../types/resource.ts'
import type Response from '../../types/response.ts'
import type User from '../../types/user.ts'
import { PROVIDERS } from '../../types/provider.ts'
import DB from '../../DB.ts'
import AccountRepository from './repository.ts'
import getMessage from '../../utils/get-message.ts'
import expectUsersAccountsTokens from '../../utils/testing/expect-users-accounts-tokens.ts'
import setupUser from '../../utils/testing/setup-user.ts'
import stringToReadableStream from '../../utils/transformers/string-to/readable-stream.ts'
import AccountController from './controller.ts'

describe('AccountController', () => {
  afterEach(DB.clear)
  afterAll(DB.close)

  describe('list', () => {
    it('returns a list of providers', async () => {
      const { user } = await setupUser({ createToken: false })
      const ctx = createMockContext({
        state: { client: user }
      })

      await AccountController.list(ctx)
      expect(ctx.response.status).toBe(Status.OK)
      expect(((ctx.response.body as Response).data as Resource[]).length).toBe(1)
    })
  })

  describe('get', () => {
    it('packages the account in state as a response', async () => {
      const { user, account } = await setupUser({ createToken: false })
      const provider = account?.provider ?? PROVIDERS.GOOGLE
      const ctx = createMockContext({
        state: { client: user, account }
      })

      AccountController.get(ctx)
      const p = (ctx.response.body as Response)?.data as ProviderResource
      expect(p.type).toBe('provider')
      expect(p.id).toBe(provider)
    })
  })

  describe('create', () => {
    const mockContext = (provider: Provider, user: User = { id: crypto.randomUUID(), name: 'Nobody' }): { mock: ProviderID, ctx: Context } => {
      const mock: ProviderID = { name: 'John Doe', provider: PROVIDERS.GOOGLE, pid: '1' }
      const body = { data: { type: 'tokens', attributes: { provider, token: 'oauth-access-token' } } }
      const ctx = createMockContext({
        state: { client: user },
        body: stringToReadableStream(JSON.stringify(body))
      })
      return { mock, ctx }
    }

    it('throws an error if no such user exists', async () => {
      const { mock, ctx } = mockContext(PROVIDERS.GOOGLE)
      try {
        await AccountController.create(ctx, mock)
        expect(0).toBe('Should throw 404 if user does not exist.')
      } catch (err) {
        expect((err as HttpError).status).toBe(Status.NotFound)
        expect((err as HttpError).message).toBe(getMessage('user_not_found'))
        await expectUsersAccountsTokens({ users: 0, accounts: 0, tokens: 0 })
      }
    })

    it('does nothing if given a valid token for an existing account', async () => {
      const { user } = await setupUser({ createAccount: false, createToken: false })
      const pid = '1'
      const repository = new AccountRepository()
      const providers = Object.values(PROVIDERS) as Provider[]
      let accounts = 0
      for (const provider of providers) {
        accounts++
        await repository.save({ uid: user.id!, provider, pid })
        const { mock, ctx } = mockContext(provider, user)
        await AccountController.create(ctx, mock)
        await expectUsersAccountsTokens({ users: 1, accounts, tokens: 0 })
      }
    })

    it('throws an error if given an invalid token', async () => {
      const { user } = await setupUser({ createAccount: false, createToken: false })
      const providers = Object.values(PROVIDERS) as Provider[]
      for (const provider of providers) {
        const { ctx } = mockContext(provider, user)
        try {
          await AccountController.create(ctx)
          expect(0).toBe('Should throw 400 error when given an invalid token.')
        } catch (err) {
          expect((err as HttpError).status).toBe(Status.BadRequest)
          expect((err as HttpError).message).toBe(getMessage('invalid_auth_token'))
          await expectUsersAccountsTokens({ users: 1, accounts: 0, tokens: 0 })
        }
      }
    })

    it('adds an account', async () => {
      const { user } = await setupUser({ createAccount: false, createToken: false })
      const providers = Object.values(PROVIDERS) as Provider[]
      let accounts = 0
      for (const provider of providers) {
        accounts++
        const { mock, ctx } = mockContext(provider, user)
        await AccountController.create(ctx, mock)
        await expectUsersAccountsTokens({ users: 1, accounts, tokens: 0 })
      }
    })
  })

  describe('delete', () => {
    it('deletes account', async () => {
      const { account } = await setupUser({ createToken: false })
      const ctx = createMockContext({ state: { account } })
      await AccountController.delete(ctx)
      await expectUsersAccountsTokens({ users: 1, accounts: 0, tokens: 0 })
    })
  })
})
