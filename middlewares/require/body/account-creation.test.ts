import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { HttpError, Status } from '@oak/oak'
import { createMockContext } from '@oak/oak/testing'
import { createTokenCreation } from '../../../types/token-creation.ts'
import createNextSpy from '../../../utils/testing/create-next-spy.ts'
import stringToReadableStream from '../../../utils/transformers/string-to/readable-stream.ts'
import getMessage from '../../../utils/get-message.ts'
import requireAccountCreationBody from './account-creation.ts'

describe('requireAccountCreationBody', () => {
  it('proceeds if given an account creation object', async () => {
    const ctx = createMockContext({
      body: stringToReadableStream(JSON.stringify(createTokenCreation()))
    })

    const next = createNextSpy()
    await requireAccountCreationBody(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('throws 400 error if not given an account creation object', async () => {
    const ctx = createMockContext({
      body: stringToReadableStream(JSON.stringify({ data: { type: 'tokens', attributes: { token: 'test' } } }))
    })

    const next = createNextSpy()

    try {
      await requireAccountCreationBody(ctx, next)
      expect(0).toBe('Invalid TokenCreation for new account should throw 400 error.')
    } catch (err) {
      expect((err as HttpError).message).toBe(getMessage('invalid_account_post'))
      expect((err as HttpError).status).toBe(Status.BadRequest)
      expect(next.calls).toHaveLength(0)
    }
  })
})
