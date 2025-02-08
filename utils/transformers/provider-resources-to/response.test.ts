import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { PROVIDERS } from '../../../types/provider.ts'
import type ProviderResource from '../../../types/provider-resource.ts'
import getRoot from '../../get-root.ts'
import providerResourcesToResponse from './response.ts'

describe('providerResourcesToResponse', () => {
  it('generates a Response for a single provider resource', () => {
    const data: ProviderResource = {
      type: 'provider',
      id: PROVIDERS.GOOGLE
    }

    const actual = providerResourcesToResponse(data)
    const expected = {
      jsonapi: { version: '1.1' },
      links: {
        self: `${getRoot()}/accounts`,
        describedBy: `${getRoot()}/docs`
      },
      data
    }
    expect(actual).toEqual(expected)
  })

  it('generates a Response for multiple provider resources', () => {
    const providers: ProviderResource[] = Object.values(PROVIDERS)
      .map(id => ({ type: 'provider', id }))

    const actual = providerResourcesToResponse(providers)
    const ids = (actual.data as ProviderResource[]).map(p => p.id)
    expect(ids).toHaveLength(providers.length)
    expect(providers.every(p => ids.includes(p.id))).toBe(true)
  })
})
