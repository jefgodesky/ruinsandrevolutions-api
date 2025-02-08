import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getRolePermissions from './get-role-permissions.ts'

describe('getRolePermissions', () => {
  it('returns anonymous permissions if given no parameter', () => {
    const actual = getRolePermissions()
    expect(Array.isArray(actual)).toBe(true)
    expect(actual.length).toBeGreaterThan(0)
  })

  it('returns the permissions associated with a given role', () => {
    const actual = getRolePermissions('active')
    expect(Array.isArray(actual)).toBe(true)
    expect(actual.length).toBeGreaterThan(0)
  })
})
