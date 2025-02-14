import { Router } from '@oak/oak'
import TableController from './controller.ts'
import loadClient from '../../middlewares/load/client.ts'
import loadItemCreation from '../../middlewares/load/item-creation.ts'
import loadBackupAuthor from '../../middlewares/load/backup-author.ts'
import loadResource from '../../middlewares/load/resource.ts'
import requireClient from '../../middlewares/require/client.ts'
import requireItemCreation from '../../middlewares/require/resources/item-creation.ts'
import requirePermissions from '../../middlewares/require/permissions.ts'
import requireTable from '../../middlewares/require/resources/table.ts'
import requireTablePatchBody from '../../middlewares/require/body/table-patch.ts'
import getPrefix from '../../utils/get-prefix.ts'

const router = new Router({
  prefix: getPrefix('tables')
})

router.post('/',
  loadClient,
  requireClient,
  loadItemCreation,
  requireItemCreation('invalid_table_creation'),
  loadBackupAuthor,
  requirePermissions('table:create'),
  async ctx => {
    await TableController.create(ctx)
  })

router.get('/',
  loadClient,
  requirePermissions('table:read'),
  async ctx => {
    await TableController.list(ctx)
  })

router.get('/:tableId',
  loadResource,
  requireTable,
  loadClient,
  requirePermissions('table:read'),
  ctx => {
    TableController.get(ctx)
  })

router.patch('/:tableId',
  requireTablePatchBody,
  loadResource,
  loadClient,
  requireTable,
  requireClient,
  requirePermissions('table:update'),
  async ctx => {
    await TableController.update(ctx)
  })

export default router
