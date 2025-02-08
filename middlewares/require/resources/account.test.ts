import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { HttpError, Status } from '@oak/oak'
import { createMockContext } from '@oak/oak/testing'
import { createAccount } from '../../../types/account.ts'
import createNextSpy from '../../../utils/testing/create-next-spy.ts'
import getMessage from '../../../utils/get-message.ts'
import requireAccount from './account.ts'

describe('requireAccount', () => {
  it('proceeds if there is an account resource in state', async () => {
    const ctx = createMockContext({
      state: { account: createAccount() }
    })

    const next = createNextSpy()
    await requireAccount(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('returns 404 if there is no account', async () => {
    const ctx = createMockContext()
    const next = createNextSpy()

    try {
      await requireAccount(ctx, next)
      expect(0).toBe('No account found should throw a 404 error.')
    } catch (err) {
      expect((err as HttpError).message).toBe(getMessage('account_not_found'))
      expect((err as HttpError).status).toBe(Status.NotFound)
      expect(next.calls).toHaveLength(0)
    }
  })
})
