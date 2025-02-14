import { Middleware, Status } from '@oak/oak'
import { createHttpError } from 'jsr:@oak/commons@1/http_errors'
import { isTablePatch } from '../../../types/table-patch.ts'
import getMessage from '../../../utils/get-message.ts'

const requireTablePatchBody: Middleware = async (ctx, next) => {
  const body = await ctx.request.body.json()
  if (!isTablePatch(body)) throw createHttpError(Status.BadRequest, getMessage('invalid_table_patch'))
  await next()
}

export default requireTablePatchBody
