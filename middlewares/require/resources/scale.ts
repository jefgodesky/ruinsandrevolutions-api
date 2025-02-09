import { Middleware, Status } from '@oak/oak'
import { createHttpError } from 'jsr:@oak/commons@1/http_errors'
import { isScale } from '../../../types/scale.ts'
import getMessage from '../../../utils/get-message.ts'

const requireScale: Middleware = async (ctx, next) => {
  if (!ctx.state.scale || !isScale(ctx.state.scale)) throw createHttpError(Status.NotFound, getMessage('scale_not_found'))
  await next()
}

export default requireScale
