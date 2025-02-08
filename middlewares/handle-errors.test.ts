import { describe,it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { Router, Status, createHttpError } from '@oak/oak'
import { createMockContext } from '@oak/oak/testing'
import type Response from '../types/response.ts'
import AccountRouter from '../collections/accounts/router.ts'
import handleErrors from './handle-errors.ts'

describe('handleErrors', () => {
  const routers: Record<string, Router> = {
    accounts: AccountRouter
  }

  it('catches and sends HTTP errors', async () => {
    const middleware = () => {
      throw createHttpError(Status.InternalServerError, 'Test')
    }

    const ctx = createMockContext()
    const handler = handleErrors(routers)
    await handler(ctx, middleware)

    const err = (ctx.response.body as Response).errors![0]
    expect(ctx.response.status).toBe(Status.InternalServerError)
    expect(ctx.response.type).toBe('application/vnd.api+json')
    expect(err.status).toBe(Status.InternalServerError.toString())
    expect(err.detail).toBe('Test')
  })
})
