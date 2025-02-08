import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { HttpError, Status } from '@oak/oak'
import { createMockContext } from '@oak/oak/testing'
import { createUser } from '../../../types/user.ts'
import createNextSpy from '../../../utils/testing/create-next-spy.ts'
import getMessage from '../../../utils/get-message.ts'
import requireUser from './user.ts'

describe('requireUser', () => {
  it('proceeds if there is a user resource in state', async () => {
    const ctx = createMockContext({
      state: { user: createUser() }
    })

    const next = createNextSpy()
    await requireUser(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('returns 404 if there is no user', async () => {
    const ctx = createMockContext()
    const next = createNextSpy()

    try {
      await requireUser(ctx, next)
      expect(0).toBe('No user found should throw a 404 error.')
    } catch (err) {
      expect((err as HttpError).message).toBe(getMessage('user_not_found'))
      expect((err as HttpError).status).toBe(Status.NotFound)
      expect(next.calls).toHaveLength(0)
    }
  })
})
