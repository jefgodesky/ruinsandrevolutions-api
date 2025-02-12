import { Middleware, Status } from '@oak/oak'
import { createHttpError } from 'jsr:@oak/commons@1/http_errors'
import { isScrollPatch } from '../../../types/scroll-patch.ts'
import getMessage from '../../../utils/get-message.ts'

const requireScrollPatchBody: Middleware = async (ctx, next) => {
  const body = await ctx.request.body.json()
  if (!isScrollPatch(body)) throw createHttpError(Status.BadRequest, getMessage('invalid_scroll_patch'))
  await next()
}

export default requireScrollPatchBody
