import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { HttpError, Status } from '@oak/oak'
import { createMockContext } from '@oak/oak/testing'
import { createScaleCreation } from '../../../types/scale-creation.ts'
import createNextSpy from '../../../utils/testing/create-next-spy.ts'
import getMessage from '../../../utils/get-message.ts'
import requireItemCreation from './item-creation.ts'

describe('requireItemCreation', () => {
  it('proceeds if given a ScaleCreation object', async () => {
    const ctx = createMockContext({
      state: { itemCreation: createScaleCreation() }
    })

    const next = createNextSpy()
    const fn = requireItemCreation('invalid_scale_creation')
    await fn(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('throws 400 error if not given an item creation object', async () => {
    const errKey: string = 'invalid_scale_creation'
    const fn = requireItemCreation(errKey)
    const ctx = createMockContext()
    const next = createNextSpy()

    try {
      await fn(ctx, next)
      expect(0).toBe('Invalid Creation for new account should throw 400 error.')
    } catch (err) {
      expect((err as HttpError).message).toBe(getMessage(errKey))
      expect((err as HttpError).status).toBe(Status.BadRequest)
      expect(next.calls).toHaveLength(0)
    }
  })
})
