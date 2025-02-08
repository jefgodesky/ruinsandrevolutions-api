import { Middleware, Status } from '@oak/oak'
import { createHttpError } from 'jsr:@oak/commons@1/http_errors'
import getMessage from '../../../utils/get-message.ts'

const requireAccount: Middleware = async (ctx, next) => {
  if (!ctx.state.account) throw createHttpError(Status.NotFound, getMessage('account_not_found'))
  await next()
}

export default requireAccount
