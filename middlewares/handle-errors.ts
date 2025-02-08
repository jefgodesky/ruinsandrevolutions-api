import { Middleware, Context, Next, Router, Status, isHttpError } from '@oak/oak'
import addErrorHeaders from '../utils/add-error-headers.ts'
import getJSONAPI from '../utils/get-jsonapi.ts'
import getRoot from '../utils/get-root.ts'

const handleErrors = (routers: Record<string, Router>): Middleware => {
  return async (ctx: Context, next: Next) => {
    try {
      await next()
    } catch (err) {
      if (isHttpError(err)) {
        ctx.response.status = err.status ?? Status.InternalServerError
        addErrorHeaders(ctx, routers)

        ctx.response.type = 'application/vnd.api+json'
        ctx.response.body = {
          jsonapi: getJSONAPI(),
          links: {
            self: ctx.request.url.toString(),
            describedBy: getRoot() + '/docs'
          },
          errors: [
            {
              status: err.status.toString(),
              detail: err.message
            }
          ]
        }
      }
    }
  }
}

export default handleErrors
