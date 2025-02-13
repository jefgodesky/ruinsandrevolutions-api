import { Application, type Router } from '@oak/oak'

import DB from './DB.ts'

import AccountRouter from './collections/accounts/router.ts'
import AuthRouter from './collections/auth/router.ts'
import ScaleRouter from './collections/scales/router.ts'
import ScrollRouter from './collections/scrolls/router.ts'
import TableRouter from './collections/tables/router.ts'
import UserRouter from './collections/users/router.ts'

import loadRouteParams from './middlewares/load/route-params.ts'
import enforceJsonApiContentType from './middlewares/jsonapi/content-type.ts'
import enforceJsonApiAccept from './middlewares/jsonapi/accept.ts'
import endpointNotFound from './middlewares/endpoint-not-found.ts'
import handleErrors from './middlewares/handle-errors.ts'
import RootRouter from './collections/base/router.ts'
import Swagger from './middlewares/swagger.ts'

const api = new Application()
const routers: Record<string, Router> = {
  accounts: AccountRouter,
  auth: AuthRouter.router,
  scales: ScaleRouter,
  scrolls: ScrollRouter,
  tables: TableRouter,
  users: UserRouter
}

api.use(Swagger.routes())
api.use(handleErrors(routers))
api.use(loadRouteParams(routers))
api.use(enforceJsonApiContentType)
api.use(enforceJsonApiAccept)

const root = new RootRouter(routers)
api.use(root.router.routes())

for (const router of Object.values(routers)) {
  api.use(router.routes())
}

api.use(endpointNotFound(routers))

api.addEventListener('listen', ({ hostname, port, secure }) => {
  const protocol = secure ? 'https' : 'http'
  const url = `${protocol}://${hostname ?? 'localhost'}:${port}`
  console.log(`⚡ Listening on ${url}`)
})

api.addEventListener('close', async () => {
  await DB.close()
})

export default api
