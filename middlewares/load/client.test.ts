import { describe, afterEach, afterAll, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import DB from '../../DB.ts'
import RoleRepository from '../../collections/users/roles/repository.ts'
import setupUser from '../../utils/testing/setup-user.ts'
import getRolePermissions from '../../utils/get-role-permissions.ts'
import authTokenToJWT from '../../utils/transformers/auth-token-to/jwt.ts'
import loadClient from './client.ts'

describe('loadClient', () => {
  afterEach(DB.clear)
  afterAll(DB.close)

  it('proceeds if not given an authorization header', async () => {
    const ctx = createMockContext()
    const anon = getRolePermissions()
    await loadClient(ctx, createMockNext())

    expect(ctx.state.client).not.toBeDefined()
    expect(ctx.state.permissions).toEqual(anon)
  })

  it('proceeds if not given a valid authorization header', async () => {
    const ctx = createMockContext({
      headers: [['Authorization', 'Bearer bad']]
    })

    const anon = getRolePermissions()
    await loadClient(ctx, createMockNext())

    expect(ctx.state.client).not.toBeDefined()
    expect(ctx.state.permissions).toEqual(anon)
  })

  it('proceeds if given an expired token', async () => {
    const { token } = await setupUser()
    token!.expiration.token = new Date(Date.now() - (5 * 60 * 1000))
    const jwt = await authTokenToJWT(token!)
    const ctx = createMockContext({
      headers: [['Authorization', `Bearer ${jwt}`]]
    })

    const anon = getRolePermissions()
    await loadClient(ctx, createMockNext())

    expect(ctx.state.client).not.toBeDefined()
    expect(ctx.state.permissions).toEqual(anon)
  })

  it('proceeds if user has been deactivated', async () => {
    const roles = new RoleRepository()
    const { user, token } = await setupUser()
    const jwt = await authTokenToJWT(token!)
    const ctx = createMockContext({
      headers: [['Authorization', `Bearer ${jwt}`]]
    })

    await roles.revoke(user.id!, 'active')
    const anon: string[] = getRolePermissions()
    await loadClient(ctx, createMockNext())

    expect(ctx.state.client).not.toBeDefined()
    expect(ctx.state.permissions).toEqual(anon)
  })

  it('attaches the client user', async () => {
    const { user, token } = await setupUser()
    const jwt = await authTokenToJWT(token!)
    const ctx = createMockContext({
      headers: [['Authorization', `Bearer ${jwt}`]]
    })
    await loadClient(ctx, createMockNext())

    expect(ctx.state.client).toBeDefined()
    expect(ctx.state.client?.name).toBe(user.name)
    expect(ctx.state.permissions.length).toBeGreaterThan(0)
  })
})
