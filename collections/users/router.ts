import { Router } from '@oak/oak'
import UserController from './controller.ts'
import RoleRouter from './roles/router.ts'
import loadClient from '../../middlewares/load/client.ts'
import loadResource from '../../middlewares/load/resource.ts'
import requireClient from '../../middlewares/require/client.ts'
import requirePermissions from '../../middlewares/require/permissions.ts'
import requireUser from '../../middlewares/require/resources/user.ts'
import requireUserRole from '../../middlewares/require/resources/user-role.ts'
import getPrefix from '../../utils/get-prefix.ts'

const router = new Router({
  prefix: getPrefix('users')
})

router.get('/:userId',
  loadResource,
  requireUser,
  requireUserRole('listed'),
  ctx => {
    UserController.get(ctx)
  })

router.patch('/:userId',
  loadClient,
  requireClient,
  loadResource,
  requireUser,
  requirePermissions('user:update'),
  async ctx => {
    await UserController.patch(ctx)
  })

router.delete('/:userId',
  loadClient,
  requireClient,
  loadResource,
  requireUser,
  requirePermissions('user:destroy'),
  async ctx => {
    await UserController.destroy(ctx)
  })

const subrouters: Record<string, Router> = {
  roles: RoleRouter
}

for (const subrouter of Object.values(subrouters)) {
  router.use('/:userId/', subrouter.routes())
}

export default router
