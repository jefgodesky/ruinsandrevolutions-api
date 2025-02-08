import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import { createUser } from '../../types/user.ts'
import checkRoleSelfPermission from './role-self.ts'

describe('checkRoleSelfPermission', () => {
  const user = createUser()
  const client = createUser({ name: 'Jane Doe', username: 'jane' })
  const params = { role: 'test' }

  it('returns false if given no role param', () => {
    const ctx = createMockContext({
      state: { permissions: ['role:self:test:grant'], user, client: user, params: {} }
    })
    expect(checkRoleSelfPermission(ctx, 'role:grant')).toBe(false)
  })

  it('returns false if the client does not have the self version', () => {
    const ctx = createMockContext({
      state: { permissions: [], user, client: user, params }
    })
    expect(checkRoleSelfPermission(ctx, 'role:grant')).toBe(false)
  })

  it('returns false if the permission is granted but there is no client', () => {
    const ctx = createMockContext({
      state: { permissions: ['role:self:test:grant'], user, params }
    })
    expect(checkRoleSelfPermission(ctx, 'role:grant')).toBe(false)
  })

  it('returns false if the permission is granted but you\'re not the user', () => {
    const ctx = createMockContext({
      state: { permissions: ['role:self:test:grant'], user, client, params }
    })
    expect(checkRoleSelfPermission(ctx, 'role:grant')).toBe(false)
  })

  it('returns true if the permission is granted and you\'re the user', () => {
    const ctx = createMockContext({
      state: { permissions: ['role:self:test:grant'], user, client: user, params }
    })
    expect(checkRoleSelfPermission(ctx, 'role:grant')).toBe(true)
  })
})
