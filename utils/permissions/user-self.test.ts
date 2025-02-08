import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import { createUser } from '../../types/user.ts'
import checkUserSelfPermission from './user-self.ts'

describe('checkUserSelfPermission', () => {
  const user = createUser()

  it('returns false if the client does not have the self version', () => {
    const ctx = createMockContext({
      state: { permissions: [], user, client: user }
    })
    expect(checkUserSelfPermission(ctx, 'user:a')).toBe(false)
  })

  it('returns false if the permission is granted but there is no client', () => {
    const ctx = createMockContext({
      state: { permissions: ['user:self:a'], user }
    })
    expect(checkUserSelfPermission(ctx, 'user:a')).toBe(false)
  })

  it('returns false if the permission is granted but you\'re not the user', () => {
    const client = createUser({ name: 'Jane Doe', username: 'jane' })
    const ctx = createMockContext({
      state: { permissions: ['user:self:a'], user, client }
    })
    expect(checkUserSelfPermission(ctx, 'user:a')).toBe(false)
  })

  it('returns true if the permission is granted and you\'re the user', () => {
    const ctx = createMockContext({
      state: { permissions: ['user:self:a'], user, client: user }
    })
    expect(checkUserSelfPermission(ctx, 'user:a')).toBe(true)
  })
})
