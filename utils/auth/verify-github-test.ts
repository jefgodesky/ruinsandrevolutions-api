import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import verifyGitHubToken from './verify-github.ts'

describe('verifyGitHubToken', () => {
  it('returns false if not given a valid GitHub OAuth access token', async () => {
    const token = await verifyGitHubToken('nope')
    expect(token).toBe(false)
  })
})
