import Provider, { PROVIDERS } from './provider.ts'

export default interface TokenAccessAttributes {
  provider: Provider
  token: string
}

const createTokenAccessAttributes = (overrides?: Partial<TokenAccessAttributes>): TokenAccessAttributes => {
  const defaultTokenAccessAttributes: TokenAccessAttributes = {
    provider: PROVIDERS.GOOGLE,
    token: '1'
  }

  return { ...defaultTokenAccessAttributes, ...overrides }
}

export { createTokenAccessAttributes }
