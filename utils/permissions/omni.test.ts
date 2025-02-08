import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import checkOmniPermission from './omni.ts'

describe('checkOmniPermission', () => {
  it('returns false if the client does not have omni-permission', () => {
    const ctx = createMockContext()
    expect(checkOmniPermission(ctx)).toBe(false)
  })

  it('returns true if the client has omni-permission', () => {
    const ctx = createMockContext({ state: { permissions: ['*'] }})
    expect(checkOmniPermission(ctx)).toBe(true)
  })
})
