import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createUser } from '../../../types/user.ts'
import { createProviderID } from '../../../types/provider-id.ts'
import userProviderIDToAccount from './account.ts'

describe('userProviderIDToAccount', () => {
  it('returns an Account', () => {
    const user = createUser()
    const pid = createProviderID()

    const actual = userProviderIDToAccount(user, pid)
    expect(actual.uid).toBe(user.id)
    expect(actual.provider).toBe(pid.provider)
    expect(actual.pid).toBe(pid.pid)
  })
})
