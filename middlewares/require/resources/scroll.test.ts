import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { HttpError, Status } from '@oak/oak'
import { createMockContext } from '@oak/oak/testing'
import { createScroll } from '../../../types/scroll.ts'
import createNextSpy from '../../../utils/testing/create-next-spy.ts'
import getMessage from '../../../utils/get-message.ts'
import requireScroll from './scroll.ts'

describe('requireScroll', () => {
  it('proceeds if there is a scroll resource in state', async () => {
    const ctx = createMockContext({
      state: { scroll: createScroll() }
    })

    const next = createNextSpy()
    await requireScroll(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('returns 404 if there is no scroll', async () => {
    const ctx = createMockContext()
    const next = createNextSpy()

    try {
      await requireScroll(ctx, next)
      expect(0).toBe('No scroll found should throw a 404 error.')
    } catch (err) {
      expect((err as HttpError).message).toBe(getMessage('scroll_not_found'))
      expect((err as HttpError).status).toBe(Status.NotFound)
      expect(next.calls).toHaveLength(0)
    }
  })
})
