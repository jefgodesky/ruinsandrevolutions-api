import { Router } from '@oak/oak'
import RoleController from './controller.ts'
import loadClient from '../../../middlewares/load/client.ts'
import loadResource from '../../../middlewares/load/resource.ts'
import requireClient from '../../../middlewares/require/client.ts'
import requirePermissions from '../../../middlewares/require/permissions.ts'
import requireUser from '../../../middlewares/require/resources/user.ts'

const router = new Router({
  prefix: 'roles'
})

router.post('/:role',
  loadClient,
  requireClient,
  loadResource,
  requireUser,
  requirePermissions('role:grant'),
  async ctx => {
    await RoleController.grant(ctx)
  })

router.delete('/:role',
  loadClient,
  requireClient,
  loadResource,
  requireUser,
  requirePermissions('role:revoke'),
  async ctx => {
    await RoleController.revoke(ctx)
  })

export default router
