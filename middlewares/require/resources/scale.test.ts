import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { HttpError, Status } from '@oak/oak'
import { createMockContext } from '@oak/oak/testing'
import { createScale } from '../../../types/scale.ts'
import createNextSpy from '../../../utils/testing/create-next-spy.ts'
import getMessage from '../../../utils/get-message.ts'
import requireScale from './scale.ts'

describe('requireScale', () => {
  it('proceeds if there is a scale resource in state', async () => {
    const ctx = createMockContext({
      state: { scale: createScale() }
    })

    const next = createNextSpy()
    await requireScale(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('returns 404 if there is no scale', async () => {
    const ctx = createMockContext()
    const next = createNextSpy()

    try {
      await requireScale(ctx, next)
      expect(0).toBe('No scale found should throw a 404 error.')
    } catch (err) {
      expect((err as HttpError).message).toBe(getMessage('scale_not_found'))
      expect((err as HttpError).status).toBe(Status.NotFound)
      expect(next.calls).toHaveLength(0)
    }
  })
})
