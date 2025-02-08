import Provider, { PROVIDERS } from './provider.ts'
import type Model from './model.ts'

export default interface Account extends Model {
  id?: string
  uid: string
  provider: Provider
  pid: string
}

const createAccount = (overrides?: Partial<Account>): Account => {
  const defaultAccount: Account = {
    id: crypto.randomUUID(),
    uid: crypto.randomUUID(),
    provider: PROVIDERS.GOOGLE,
    pid: '1'
  }

  return { ...defaultAccount, ...overrides }
}

export { createAccount }
