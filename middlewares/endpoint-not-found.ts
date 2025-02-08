import { Middleware, Status } from '@oak/oak'
import { createHttpError } from 'jsr:@oak/commons@1/http_errors'
import { Context, Router } from '@oak/oak'
import getMessage from '../utils/get-message.ts'
import getAllowedMethods from '../utils/get-allowed-methods.ts'

const endpointNotFound = (routers: Record<string, Router>): Middleware => {
  return (ctx: Context) => {
    const methods = getAllowedMethods(ctx.request.url.pathname, routers)
    if (methods.length < 1) {
      throw createHttpError(Status.NotFound, getMessage('endpoint_not_found'))
    } else {
      throw createHttpError(Status.MethodNotAllowed, getMessage('method_not_allowed'))
    }
  }
}

export default endpointNotFound
