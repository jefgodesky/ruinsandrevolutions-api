export default interface TokenRefreshAttributes {
  token: string
}

const createTokenRefreshAttributes = (overrides?: Partial<TokenRefreshAttributes>): TokenRefreshAttributes => {
  const defaultTokenRefreshAttributes: TokenRefreshAttributes = {
    token: '1'
  }

  return { ...defaultTokenRefreshAttributes, ...overrides }
}

export { createTokenRefreshAttributes }
