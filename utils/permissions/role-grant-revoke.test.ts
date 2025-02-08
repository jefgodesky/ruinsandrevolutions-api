import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import checkRoleGrantRevokePermission from './role-grant-revoke.ts'

describe('checkRoleGrantRevokePermission', () => {
  it('checks if the client has the request grant/revoke permissions for a role', () => {
    const role = 'test'
    const scenarios: [string[], string, boolean][] = [
      [[], 'role:grant', false],
      [['role:test:grant'], 'role:grant', true],
      [[], 'role:revoke', false],
      [['role:test:revoke'], 'role:revoke', true]
    ]

    for (const [permissions, required, expected] of scenarios) {
      const ctx = createMockContext({
        state: { permissions, params: { role } }
      })
      expect(checkRoleGrantRevokePermission(ctx, required)).toBe(expected)
    }
  })
})
