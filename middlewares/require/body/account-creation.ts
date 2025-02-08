import { Middleware, Status } from '@oak/oak'
import { createHttpError } from 'jsr:@oak/commons@1/http_errors'
import type TokenAccessAttributes from '../../../types/token-access-attributes.ts'
import { isTokenCreation } from '../../../types/token-creation.ts'
import getMessage from '../../../utils/get-message.ts'

const requireAccountCreationBody: Middleware = async (ctx, next) => {
  const body = await ctx.request.body.json()
  const err = createHttpError(Status.BadRequest, getMessage('invalid_account_post'))
  if (!isTokenCreation(body)) throw err

  const attributes = body.data.attributes as TokenAccessAttributes
  if (!attributes.provider || !attributes.token) throw err

  await next()
}

export default requireAccountCreationBody
