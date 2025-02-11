import { Router } from '@oak/oak'
import ScrollController from './controller.ts'
import loadClient from '../../middlewares/load/client.ts'
import loadItemCreation from '../../middlewares/load/item-creation.ts'
import loadBackupAuthor from '../../middlewares/load/backup-author.ts'
import requireClient from '../../middlewares/require/client.ts'
import requireItemCreation from '../../middlewares/require/resources/item-creation.ts'
import requirePermissions from '../../middlewares/require/permissions.ts'
import getPrefix from '../../utils/get-prefix.ts'

const router = new Router({
  prefix: getPrefix('scrolls')
})

router.post('/',
  loadClient,
  requireClient,
  loadItemCreation,
  requireItemCreation('invalid_scroll_creation'),
  loadBackupAuthor,
  requirePermissions('scroll:create'),
  async ctx => {
    await ScrollController.create(ctx)
  })

export default router
