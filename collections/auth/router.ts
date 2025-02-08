import { Router } from '@oak/oak'
import RootRouter from '../base/router.ts'
import TokenRouter from './tokens/router.ts'
import ProviderRouter from './providers/router.ts'

const routers: Record<string, Router> = {
  tokens: TokenRouter,
  providers: ProviderRouter
}

const root = new RootRouter(routers, 'auth')
root.router.use(root.router.routes())

for (const subrouter of Object.values(routers)) {
  root.router.use(subrouter.routes())
}

export default root
