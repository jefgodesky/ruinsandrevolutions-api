import { describe, afterEach, afterAll, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import DB from '../DB.ts'
import getRoleConfig from './get-role-config.ts'
import setupUser from './testing/setup-user.ts'
import addRoles from './add-roles.ts'

describe('addRoles', () => {
  afterEach(async () => {
    await DB.clear()
  })

  afterAll(async () => {
    await DB.close()
  })

  it('adds roles to a user', async () => {
    const { user } = await setupUser({ createAccount: false, createToken: false })
    const actual = await addRoles(user)
    expect(actual.roles).toEqual(getRoleConfig().default)
  })
})
