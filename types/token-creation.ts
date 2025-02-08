import { PROVIDERS } from './provider.ts'
import TokenAccessAttributes, { createTokenAccessAttributes } from './token-access-attributes.ts'
import type TokenRefreshAttributes from './token-refresh-attributes.ts'

export default interface TokenCreation {
  data: {
    type: 'tokens'
    attributes: TokenAccessAttributes | TokenRefreshAttributes
  }
}

const createTokenCreation = (overrides?: Partial<TokenCreation>): TokenCreation => {
  const defaultTokenCreation: TokenCreation = {
    data: {
      type: 'tokens',
      attributes: createTokenAccessAttributes(overrides?.data?.attributes)
    }
  }

  return { ...defaultTokenCreation, ...overrides }
}

// deno-lint-ignore no-explicit-any
const isTokenCreation = (candidate: any): candidate is TokenCreation => {
  if (!candidate?.data) return false

  const { data } = candidate
  if (Object.keys(data).join(',') !== 'type,attributes') return false

  const { type, attributes } = data
  if (type !== 'tokens') return false

  const { token, provider } = attributes
  if (provider !== undefined && !Object.values(PROVIDERS).includes(provider)) return false
  return typeof token === 'string'
}

export {
  createTokenCreation,
  isTokenCreation
}
