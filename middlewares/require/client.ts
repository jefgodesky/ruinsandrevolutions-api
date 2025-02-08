import { Middleware, Status, createHttpError } from '@oak/oak'
import { isUser } from '../../types/user.ts'
import getMessage from '../../utils/get-message.ts'

const requireClient: Middleware = async (ctx, next) => {
  if (!ctx.state.client || !isUser(ctx.state.client)) throw createHttpError(Status.Unauthorized, getMessage('authentication_required'))
  await next()
}

export default requireClient
