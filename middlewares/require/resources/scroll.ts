import { Middleware, Status } from '@oak/oak'
import { createHttpError } from 'jsr:@oak/commons@1/http_errors'
import { isScroll } from '../../../types/scroll.ts'
import getMessage from '../../../utils/get-message.ts'

const requireScroll: Middleware = async (ctx, next) => {
  if (!ctx.state.scroll || !isScroll(ctx.state.scroll)) throw createHttpError(Status.NotFound, getMessage('scroll_not_found'))
  await next()
}

export default requireScroll
