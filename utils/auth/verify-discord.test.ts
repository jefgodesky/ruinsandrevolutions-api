import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import verifyDiscordToken from './verify-discord.ts'

describe('verifyDiscordToken', () => {
  it('returns false if not given a valid Discord OAuth access token', async () => {
    const token = await verifyDiscordToken('nope')
    expect(token).toBe(false)
  })
})
