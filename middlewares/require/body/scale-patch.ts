import { Middleware, Status } from '@oak/oak'
import { createHttpError } from 'jsr:@oak/commons@1/http_errors'
import { isScalePatch } from '../../../types/scale-patch.ts'
import getMessage from '../../../utils/get-message.ts'

const requireScalePatchBody: Middleware = async (ctx, next) => {
  const body = await ctx.request.body.json()
  if (!isScalePatch(body)) throw createHttpError(Status.BadRequest, getMessage('invalid_scale_patch'))
  await next()
}

export default requireScalePatchBody
