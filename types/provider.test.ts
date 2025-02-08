import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { PROVIDERS, isProvider } from './provider.ts'

describe('isProvider', () => {
  it('returns false if given anything other than a string', () => {
    const primitives = [() => {}, null, undefined, true, false, 1]
    for (const primitive of primitives) {
      expect(isProvider(primitive)).toBe(false)
    }
  })

  it('returns false if given a random string', () => {
    expect(isProvider('test')).toBe(false)
  })

  it('returns true if given a random a provider', () => {
    const providers: string[] = Object.values(PROVIDERS) as string[]
    for (const provider of providers) {
      expect(isProvider(provider)).toBe(true)
    }
  })
})
