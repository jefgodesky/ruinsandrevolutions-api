import { describe, afterEach, afterAll, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import { PROVIDERS}  from '../../types/provider.ts'
import DB from '../../DB.ts'
import setupUser from '../../utils/testing/setup-user.ts'
import loadAccount from './account.ts'

describe('loadAccount', () => {
  afterEach(DB.clear)
  afterAll(DB.close)

  it('loads the client\'s requested account', async () => {
    const { user, account } = await setupUser({ createToken: false })
    const provider = account?.provider ?? PROVIDERS.GOOGLE
    const ctx = createMockContext({
      state: { client: user, params: { provider } }
    })
    await loadAccount(ctx, createMockNext())

    expect(ctx.state.account).toBeDefined()
    expect(ctx.state.account.provider).toBe(provider)
    expect(ctx.state.account.uid).toBe(user.id)
  })
})
