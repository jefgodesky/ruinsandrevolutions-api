import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import sendNoContent from './send-no-content.ts'

describe('sendNoContent', () => {
  it('sends a 204 response', () => {
    const ctx = createMockContext()
    sendNoContent(ctx)

    expect(ctx.response.status).toBe(204)
    expect(ctx.response.type).toBeUndefined()
    expect(ctx.response.body).toBeUndefined()
  })
})
