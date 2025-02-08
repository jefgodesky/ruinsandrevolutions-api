import Provider, { PROVIDERS } from './provider.ts'

export default interface ProviderID {
  name: string
  provider: Provider
  pid: string
}


const createProviderID = (overrides?: Partial<ProviderID>): ProviderID => {
  const defaultProviderID: ProviderID = {
    name: 'John Doe',
    provider: PROVIDERS.GOOGLE,
    pid: '1'
  }

  return { ...defaultProviderID, ...overrides }
}

export { createProviderID }
