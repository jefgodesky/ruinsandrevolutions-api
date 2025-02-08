import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getMessage from './get-message.ts'

describe('getMessage', () => {
  it('returns the requested message', () => {
    const msg = getMessage('authentication_required')
    expect(msg).toBe('This operation requires authentication.')
  })
})
