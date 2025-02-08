import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import { createUser } from '../../types/user.ts'
import createNextSpy from '../../utils/testing/create-next-spy.ts'
import expect401 from '../../utils/testing/expect-401.ts'
import requireClient from './client.ts'

describe('requireClient', () => {
  it('proceeds if there is an authenticated client user', async () => {
    const ctx = createMockContext({
      state: { client: createUser() }
    })
    const next = createNextSpy()
    await requireClient(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('returns 401 if there is no client', async () => {
    const ctx = createMockContext()
    const next = createNextSpy()

    try {
      await requireClient(ctx, next)
      expect(0).toBe('Anonymous user should throw a 401 status error.')
    } catch (err) {
      expect401(err as Error, next)
    }
  })

  it('returns 401 if the client isn\'t a user', async () => {
    const ctx = createMockContext({
      state: { client: {} }
    })
    const next = createNextSpy()

    try {
      await requireClient(ctx, next)
      expect(0).toBe('Anonymous user should throw a 401 status error.')
    } catch (err) {
      expect401(err as Error, next)
    }
  })
})
