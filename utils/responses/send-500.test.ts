import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import send500 from './send-500.ts'

describe('send500', () => {
  it('sends a 500 error response', () => {
    const ctx = createMockContext()
    send500(ctx)
    expect(ctx.response.status).toBe(500)
    expect(ctx.response.type).not.toBeDefined()
  })
})
