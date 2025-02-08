import { Middleware } from '@oak/oak'
import AccountRepository from '../../collections/accounts/repository.ts'

const loadAccount: Middleware = async (ctx, next) => {
  const accounts = new AccountRepository()
  const { client, params } = ctx.state
  ctx.state.account = await accounts.getByUIDAndProvider(client.id, params.provider)
  await next()
}

export default loadAccount
