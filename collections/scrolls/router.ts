import { Router } from '@oak/oak'
import ScrollController from './controller.ts'
import loadClient from '../../middlewares/load/client.ts'
import loadItemCreation from '../../middlewares/load/item-creation.ts'
import loadBackupAuthor from '../../middlewares/load/backup-author.ts'
import loadScroll from '../../middlewares/load/scroll.ts'
import requireClient from '../../middlewares/require/client.ts'
import requireItemCreation from '../../middlewares/require/resources/item-creation.ts'
import requireScroll from '../../middlewares/require/resources/scroll.ts'
import requireScrollPatchBody from '../../middlewares/require/body/scroll-patch.ts'
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

router.get('/',
  loadClient,
  requirePermissions('scroll:read'),
  async ctx => {
    await ScrollController.list(ctx)
  })

router.get('/:scrollId',
  loadScroll,
  requireScroll,
  loadClient,
  requirePermissions('scroll:read'),
  ctx => {
    ScrollController.get(ctx)
  })

router.patch('/:scaleId',
  requireScrollPatchBody,
  loadScroll,
  loadClient,
  requireScroll,
  requireClient,
  requirePermissions('scroll:update'),
  async ctx => {
    await ScrollController.update(ctx)
  })

export default router
