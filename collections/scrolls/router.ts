import { Router } from '@oak/oak'
import ScrollController from './controller.ts'
import loadClient from '../../middlewares/load/client.ts'
import loadItemCreation from '../../middlewares/load/item-creation.ts'
import loadBackupAuthor from '../../middlewares/load/backup-author.ts'
import loadResource from '../../middlewares/load/resource.ts'
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
  loadResource,
  requireScroll,
  loadClient,
  requirePermissions('scroll:read'),
  ctx => {
    ScrollController.get(ctx)
  })

router.patch('/:scrollId',
  requireScrollPatchBody,
  loadResource,
  loadClient,
  requireScroll,
  requireClient,
  requirePermissions('scroll:update'),
  async ctx => {
    await ScrollController.update(ctx)
  })

router.delete('/:scrollId',
  loadResource,
  loadClient,
  requireScroll,
  requireClient,
  requirePermissions('scroll:delete'),
  async ctx => {
    await ScrollController.delete(ctx)
  })

export default router
