import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { Router } from '@oak/oak'
import AccountRouter from '../collections/accounts/router.ts'
import getAllowedMethods from './get-allowed-methods.ts'

describe('getAllowedMethods', () => {
  const routers: Record<string, Router> = {
    accounts: AccountRouter
  }

  it('returns methods allowed for the given route', () => {
    const methods = getAllowedMethods('/v1/accounts', routers)
    expect(methods).toContain('POST')
  })
})
