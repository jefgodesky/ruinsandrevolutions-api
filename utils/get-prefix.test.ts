import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getPrefix from './get-prefix.ts'

describe('getPrefix', () => {
  it('returns the version prefix if not given a collection', () => {
    const actual = getPrefix()
    expect(actual).toBe('/v1')
  })

  it('returns the router prefix', () => {
    const actual = getPrefix('tests')
    expect(actual).toBe('/v1/tests')
  })
})
