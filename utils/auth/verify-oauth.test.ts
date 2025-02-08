import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { PROVIDERS } from '../../types/provider.ts'
import verifyOAuthToken from './verify-oauth.ts'

describe('verifyOAuthToken', () => {
  it('returns false if not given a valid Google OAuth ID token', async () => {
    const token = await verifyOAuthToken(PROVIDERS.GOOGLE, 'nope')
    expect(token).toBe(false)
  })

  it('returns false if not given a valid GitHub OAuth access token', async () => {
    const token = await verifyOAuthToken(PROVIDERS.GITHUB, 'nope')
    expect(token).toBe(false)
  })

  it('returns false if not given a valid Discord OAuth access token', async () => {
    const token = await verifyOAuthToken(PROVIDERS.DISCORD, 'nope')
    expect(token).toBe(false)
  })
})
