import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { HttpError, Status } from '@oak/oak'
import { createMockContext } from '@oak/oak/testing'
import createNextSpy from '../../../utils/testing/create-next-spy.ts'
import stringToReadableStream from '../../../utils/transformers/string-to/readable-stream.ts'
import getMessage from '../../../utils/get-message.ts'
import requireTablePatchBody from './table-patch.ts'

describe('requireTablePatchBody', () => {
  it('proceeds if given a table patch object', async () => {
    const ctx = createMockContext({
      body: stringToReadableStream(JSON.stringify({
        data: {
          type: 'tables',
          id: crypto.randomUUID(),
          attributes: {
            rows: [
              { min: 1, max: 6, result: { name: 'Roll', text: { human: 'You rolled a die.' } } }
            ]
          }
        }
      }))
    })

    const next = createNextSpy()
    await requireTablePatchBody(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('throws 400 error if not given a table patch object', async () => {
    const ctx = createMockContext({
      body: stringToReadableStream(JSON.stringify({ a: 1 }))
    })
    const next = createNextSpy()

    try {
      await requireTablePatchBody(ctx, next)
      expect(0).toBe('Invalid TablePatch should throw 400 error.')
    } catch (err) {
      expect((err as HttpError).message).toBe(getMessage('invalid_table_patch'))
      expect((err as HttpError).status).toBe(Status.BadRequest)
      expect(next.calls).toHaveLength(0)
    }
  })
})
