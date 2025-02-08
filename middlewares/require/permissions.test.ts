import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import { HttpError, Status } from '@oak/oak'
import createNextSpy from '../../utils/testing/create-next-spy.ts'
import getMessage from '../../utils/get-message.ts'
import requirePermissions from './permissions.ts'

describe('requirePermissions', () => {
  it('proceeds if user has all necessary permissions', async () => {
    const ctx = createMockContext({
      state: {
        permissions: ['read', 'write'],
        client: { name: 'John Doe' }
      }
    })

    const next = createNextSpy()
    const middleware = requirePermissions('read', 'write')
    await middleware(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('proceeds if user has relevant user:self permission', async () => {
    const id = crypto.randomUUID()
    const ctx = createMockContext({
      state: {
        permissions: ['user:self:read'],
        client: { id, name: 'John Doe' },
        user: { id, name: 'John Doe' }
      }
    })

    const next = createNextSpy()
    const middleware = requirePermissions('user:read')
    await middleware(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('proceeds if user has relevant role grant permission', async () => {
    const ctx = createMockContext({
      state: {
        permissions: ['role:test:grant'],
        params: { role: 'test' }
      }
    })

    const next = createNextSpy()
    const middleware = requirePermissions('role:grant')
    await middleware(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('proceeds if user has relevant role revoke permission', async () => {
    const ctx = createMockContext({
      state: {
        permissions: ['role:test:revoke'],
        params: { role: 'test' }
      }
    })

    const next = createNextSpy()
    const middleware = requirePermissions('role:revoke')
    await middleware(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('proceeds if user has relevant role:self permission', async () => {
    const id = crypto.randomUUID()
    const ctx = createMockContext({
      state: {
        permissions: ['role:self:test:grant'],
        client: { id, name: 'John Doe' },
        user: { id, name: 'John Doe' },
        params: { role: 'test' }
      }
    })

    const next = createNextSpy()
    const middleware = requirePermissions('role:grant')
    await middleware(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('grants all permissions to someone with *', async () => {
    const ctx = createMockContext({
      state: {
        permissions: ['*'],
        client: { name: 'John Doe' }
      }
    })

    const next = createNextSpy()
    const middleware = requirePermissions('read', 'write')
    await middleware(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('returns 401 if anonymous user lacks permissions', async () => {
    const ctx = createMockContext({
      state: { permissions: ['read'] }
    })

    const next = createNextSpy()
    const middleware = requirePermissions('read', 'write')

    try {
      await middleware(ctx, next)
      expect(0).toBe('Anonymous user lacking permission should throw a 401 status error.')
    } catch (err) {
      expect((err as HttpError).message).toBe(getMessage('authentication_required'))
      expect((err as HttpError).status).toBe(Status.Unauthorized)
      expect(next.calls).toHaveLength(0)
    }
  })

  it('returns 403 if authenticated user lacks permissions', async () => {
    const ctx = createMockContext({
      state: {
        permissions: ['read'],
        client: { name: 'John Doe' }
      }
    })

    const next = createNextSpy()
    const middleware = requirePermissions('read', 'write')

    try {
      await middleware(ctx, next)
      expect(0).toBe('Authenticated user lacking permission should throw a 403 status error.')
    } catch (err) {
      expect((err as HttpError).message).toBe(getMessage('lack_permissions'))
      expect((err as HttpError).status).toBe(Status.Forbidden)
      expect(next.calls).toHaveLength(0)
    }
  })
})
