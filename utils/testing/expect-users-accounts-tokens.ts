import { expect } from '@std/expect'
import AuthTokenController from '../../collections/auth/tokens/controller.ts'

const expectUsersAccountsTokens = async (expected: { users: number, accounts: number, tokens: number }): Promise<void> => {
  const repositories = AuthTokenController.getRepositories()
  const users = await repositories.users.list()
  const accounts = await repositories.accounts.list()
  const tokens = await repositories.tokens.list()
  expect(users?.total).toBe(expected.users)
  expect(accounts?.total).toBe(expected.accounts)
  expect(tokens?.total).toBe(expected.tokens)
}

export default expectUsersAccountsTokens
