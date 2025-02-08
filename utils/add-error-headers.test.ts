import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { Status, Router } from '@oak/oak'
import { createMockContext } from '@oak/oak/testing'
import AccountRouter from '../collections/accounts/router.ts'
import getAllowedMethods from './get-allowed-methods.ts'
import addErrorHeaders from './add-error-headers.ts'

describe('addErrorHeaders', () => {
  const routers: Record<string, Router> = {
    accounts: AccountRouter
  }

  it('adds WWW-Authenticate to 401', () => {
    const ctx = createMockContext()
    ctx.response.status = Status.Unauthorized
    addErrorHeaders(ctx, routers)
    expect(ctx.response.headers.get('WWW-Authenticate')).toBe('Bearer')
  })

  it('adds Allow, Access-Control-Allow-Methods to 405', () => {
    const expected = getAllowedMethods('/v1/accounts', routers).join(', ')
    const ctx = createMockContext({
      method: 'PATCH',
      path: '/v1/accounts'
    })
    ctx.response.status = Status.MethodNotAllowed
    addErrorHeaders(ctx, routers)
    expect(ctx.response.headers.get('Allow')).toBe(expected)
    expect(ctx.response.headers.get('Access-Control-Allow-Methods')).toBe(expected)
  })
})
