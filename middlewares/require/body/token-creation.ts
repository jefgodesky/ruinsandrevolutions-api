import { Middleware, Status } from '@oak/oak'
import { createHttpError } from 'jsr:@oak/commons@1/http_errors'
import { isTokenCreation } from '../../../types/token-creation.ts'
import getMessage from '../../../utils/get-message.ts'

const requireTokenCreationBody: Middleware = async (ctx, next) => {
  const body = await ctx.request.body.json()
  if (!isTokenCreation(body)) throw createHttpError(Status.BadRequest, getMessage('invalid_token_creation'))
  await next()
}

export default requireTokenCreationBody
