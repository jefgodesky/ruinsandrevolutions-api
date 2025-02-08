import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import verifyGoogleToken from './verify-google.ts'

describe('verifyGoogleToken', () => {
  it('returns false if not given a valid Google OAuth ID token', async () => {
    const token = await verifyGoogleToken('nope')
    expect(token).toBe(false)
  })
})
