import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import checkExplicitPermission from './explicit.ts'

describe('checkExplicitPermission', () => {
  it('returns false if the permission is not explicitly granted', () => {
    const ctx = createMockContext()
    expect(checkExplicitPermission(ctx, 'a')).toBe(false)
  })

  it('returns true if the permission is explicitly granted', () => {
    const ctx = createMockContext({ state: { permissions: ['a'] }})
    expect(checkExplicitPermission(ctx, 'a')).toBe(true)
  })
})
