import { describe,it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import UserRouter from '../../collections/users/router.ts'
import loadRouteParams from './route-params.ts'

describe('loadRouteParams', () => {
  it('adds route params to state', async () => {
    const middleware = loadRouteParams({ users: UserRouter })
    const ctx = createMockContext({
      path: '/v1/users/test'
    })
    await middleware(ctx, createMockNext())
    expect(ctx.state.params.userId).toBe('test')
  })
})
