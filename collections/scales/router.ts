import { Router } from '@oak/oak'
import ScaleController from './controller.ts'
import loadClient from '../../middlewares/load/client.ts'
import loadItemCreation from '../../middlewares/load/item-creation.ts'
import loadBackupAuthor from '../../middlewares/load/backup-author.ts'
import loadScale from '../../middlewares/load/scale.ts'
import requireClient from '../../middlewares/require/client.ts'
import requireItemCreation from '../../middlewares/require/resources/item-creation.ts'
import requirePermissions from '../../middlewares/require/permissions.ts'
import requireScale from '../../middlewares/require/resources/scale.ts'
import requireScalePatchBody from '../../middlewares/require/body/scale-patch.ts'
import getPrefix from '../../utils/get-prefix.ts'

const router = new Router({
  prefix: getPrefix('scales')
})

router.post('/',
  loadClient,
  requireClient,
  loadItemCreation,
  requireItemCreation('invalid_scale_creation'),
  loadBackupAuthor,
  requirePermissions('scale:create'),
  async ctx => {
    await ScaleController.create(ctx)
  })

router.get('/',
  loadClient,
  requirePermissions('scale:read'),
  async ctx => {
    await ScaleController.list(ctx)
  })

router.get('/:scaleId',
  loadScale,
  requireScale,
  loadClient,
  requirePermissions('scale:read'),
  ctx => {
    ScaleController.get(ctx)
  })

router.patch('/:scaleId',
  requireScalePatchBody,
  loadScale,
  loadClient,
  requireScale,
  requireClient,
  requirePermissions('scale:update'),
  async ctx => {
    await ScaleController.update(ctx)
  })

export default router
