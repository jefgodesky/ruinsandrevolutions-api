import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { HttpError, Status } from '@oak/oak'
import { createMockContext } from '@oak/oak/testing'
import createNextSpy from '../../../utils/testing/create-next-spy.ts'
import stringToReadableStream from '../../../utils/transformers/string-to/readable-stream.ts'
import getMessage from '../../../utils/get-message.ts'
import requireScalePatchBody from './scale-patch.ts'

describe('requireScalePatchBody', () => {
  it('proceeds if given a scale patch object', async () => {
    const ctx = createMockContext({
      body: stringToReadableStream(JSON.stringify({
        data: {
          type: 'scales',
          id: crypto.randomUUID(),
          attributes: {
            levels: ['A', 'B', 'C']
          }
        }
      }))
    })

    const next = createNextSpy()
    await requireScalePatchBody(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('throws 400 error if not given a scale patch object', async () => {
    const ctx = createMockContext({
      body: stringToReadableStream(JSON.stringify({ a: 1 }))
    })
    const next = createNextSpy()

    try {
      await requireScalePatchBody(ctx, next)
      expect(0).toBe('Invalid ScalePatch should throw 400 error.')
    } catch (err) {
      expect((err as HttpError).message).toBe(getMessage('invalid_scale_patch'))
      expect((err as HttpError).status).toBe(Status.BadRequest)
      expect(next.calls).toHaveLength(0)
    }
  })
})
