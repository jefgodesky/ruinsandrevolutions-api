import { Context, Middleware, Next, Status, createHttpError } from '@oak/oak'
import getMessage from '../../../utils/get-message.ts'

const requireItemCreation = (errKey: string): Middleware => {
  return async (ctx: Context, next: Next) => {
    if (!ctx.state.itemCreation) throw createHttpError(Status.BadRequest, getMessage(errKey))
    await next()
  }
}

export default requireItemCreation
