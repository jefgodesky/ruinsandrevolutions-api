import { describe, beforeEach, afterEach, afterAll, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { HttpError, Status } from '@oak/oak'
import { createMockContext } from '@oak/oak/testing'
import type User from '../../../types/user.ts'
import DB from '../../../DB.ts'
import createNextSpy from '../../../utils/testing/create-next-spy.ts'
import getMessage from '../../../utils/get-message.ts'
import setupUser from '../../../utils/testing/setup-user.ts'
import requireUserRole from './user-role.ts'

describe('requireUserRole', () => {
  let user: User

  beforeEach(async () => {
    ({ user } = await setupUser({ createAccount: false, createToken: false }))
  })

  afterEach(DB.clear)
  afterAll(DB.close)

  it('proceeds if the user resource has the role', async () => {
    const ctx = createMockContext({
      state: { user }
    })

    const next = createNextSpy()
    const middleware = requireUserRole('active')
    await middleware(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('returns 404 if the user does not have the role', async () => {
    const middleware = requireUserRole('test')
    const next = createNextSpy()
    const ctx = createMockContext({
      state: { user }
    })

    try {
      await middleware(ctx, next)
      expect(0).toBe('User that does not have role should throw a 404 error.')
    } catch (err) {
      expect((err as HttpError).message).toBe(getMessage('user_not_found'))
      expect((err as HttpError).status).toBe(Status.NotFound)
      expect(next.calls).toHaveLength(0)
    }
  })
})
