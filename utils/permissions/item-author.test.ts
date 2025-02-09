import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import { createScale } from '../../types/scale.ts'
import { createUser } from '../../types/user.ts'
import checkItemAuthorPermission from './item-author.ts'

describe('checkItemAuthorPermission', () => {
  const user = createUser()
  const scale = createScale({ authors: [user] })

  it('returns false if the client does not have the author version', () => {
    const ctx = createMockContext({
      state: { permissions: [], scale, client: user }
    })
    expect(checkItemAuthorPermission(ctx, 'scale:a')).toBe(false)
  })

  it('returns false if the permission is granted but there is no client', () => {
    const ctx = createMockContext({
      state: { permissions: ['scale:author:a'], scale }
    })
    expect(checkItemAuthorPermission(ctx, 'scale:a')).toBe(false)
  })

  it('returns false if the permission is granted but you\'re not an author', () => {
    const client = createUser({ name: 'Jane Doe', username: 'jane' })
    const ctx = createMockContext({
      state: { permissions: ['scale:author:a'], scale, client }
    })
    expect(checkItemAuthorPermission(ctx, 'scale:a')).toBe(false)
  })

  it('returns true if the permission is granted and you\'re an author', () => {
    const ctx = createMockContext({
      state: { permissions: ['scale:author:a'], scale, client: user }
    })
    expect(checkItemAuthorPermission(ctx, 'scale:a')).toBe(true)
  })
})
