import { Router } from '@oak/oak'
import type Response from '../../types/response.ts'
import type Links from '../../types/links.ts'
import getJSONAPI from '../../utils/get-jsonapi.ts'
import sendJSON from '../../utils/send-json.ts'
import getRoot from '../../utils/get-root.ts'
import getPrefix from '../../utils/get-prefix.ts'

class RootRouter {
  routers: Record<string, Router>
  router: Router
  prefix?: string

  constructor (routers: Record<string, Router>, prefix?: string) {
    this.prefix = prefix
    this.routers = routers
    this.router = new Router({
      prefix: prefix ? getPrefix(prefix) : getPrefix()
    })

    this.router.get('/', ctx => {
      sendJSON(ctx, this.getResponse())
    })
  }

  getResponse (): Response {
    const self = this.prefix
      ? [getRoot(), this.prefix].join('/')
      : getRoot()

    const links: Links = {
      self,
      describedBy: getRoot() + '/docs'
    }

    for (const endpoint in this.routers) {
      links[endpoint] = [self, endpoint].join('/')
    }

    return {
      jsonapi: getJSONAPI(),
      links
    }
  }
}

export default RootRouter
