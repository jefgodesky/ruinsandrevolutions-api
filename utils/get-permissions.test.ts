import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getRolePermissions from './get-role-permissions.ts'
import getPermissions from './get-permissions.ts'

describe('getPermissions', () => {
  it('returns anonymous permissions if given no parameter', async() => {
    const actual = await getPermissions()
    const anon = getRolePermissions()
    expect(actual).toEqual(anon)
  })

  it('returns the permissions that a user has', async() => {
    const actual = await getPermissions({
      id: crypto.randomUUID(),
      name: 'John Doe',
      roles: ['active', 'listed', 'admin']
    })

    const anon = getRolePermissions()
    const active = getRolePermissions('active')
    const admin = getRolePermissions('admin')

    expect(anon.every(p => actual.includes(p))).toBe(true)
    expect(active.every(p => actual.includes(p))).toBe(true)
    expect(admin.every(p => actual.includes(p))).toBe(true)
    expect(new Set(actual).size).toBe(actual.length) // No duplicates
  })
})
