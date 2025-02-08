import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createAccount } from '../../../types/account.ts'
import accountToProviderResource from './provider-resource.ts'

describe('accountToProviderResource', () => {
  it('returns a provider response', () => {
    const account = createAccount()
    const actual = accountToProviderResource(account)

    expect(actual.type).toBe('provider')
    expect(actual.id).toBe(account.provider)
  })
})
