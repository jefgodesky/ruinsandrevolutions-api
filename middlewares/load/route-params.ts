import { Middleware, Context, Next, Router } from '@oak/oak'
import getRouteParams from '../../utils/get-route-params.ts'

const loadRouteParams = (routers: Record<string, Router>): Middleware => {
  return async (ctx: Context, next: Next) => {
    ctx.state.params = {}
    for (const key in routers) {
      const router = routers[key] as Router
      router.forEach(route => {
        ctx.state.params = Object.assign(
          {},
          ctx.state.params,
          getRouteParams(ctx.request.url.pathname, route.regexp, route.paramNames)
        )
      })
    }
    await next()
  }
}

export default loadRouteParams
