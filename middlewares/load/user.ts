import { Middleware } from '@oak/oak'
import UserRepository from '../../collections/users/repository.ts'

const loadUser: Middleware = async (ctx, next) => {
  const users = new UserRepository()
  ctx.state.user = await users.getByIdOrUsername(ctx.state.params.userId)
  await next()
}

export default loadUser
