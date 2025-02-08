import { Context, Status, Router } from '@oak/oak'
import getAllowedMethods from './get-allowed-methods.ts'

const addErrorHeaders = (ctx: Context, routers: Record<string, Router>) => {
  switch (ctx.response.status) {
    case Status.Unauthorized:
      ctx.response.headers.set('WWW-Authenticate', 'Bearer')
      break
    case Status.MethodNotAllowed:
      ctx.response.headers.set('Allow', getAllowedMethods(ctx.request.url.pathname, routers).join(', '))
      ctx.response.headers.set('Access-Control-Allow-Methods', getAllowedMethods(ctx.request.url.pathname, routers).join(', '))
      break
    default:
      break
  }
}

export default addErrorHeaders
