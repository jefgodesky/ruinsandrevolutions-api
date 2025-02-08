import { Router } from '@oak/oak'
import AccountController from './controller.ts'
import getPrefix from '../../utils/get-prefix.ts'
import loadAccount from '../../middlewares/load/account.ts'
import loadClient from '../../middlewares/load/client.ts'
import requireAccount from '../../middlewares/require/resources/account.ts'
import requireClient from '../../middlewares/require/client.ts'
import requireAccountCreationBody from '../../middlewares/require/body/account-creation.ts'

const router = new Router({
  prefix: getPrefix('accounts')
})

router.post('/',
  loadClient,
  requireClient,
  requireAccountCreationBody,
  async ctx => {
    await AccountController.create(ctx)
  })

router.get('/',
  loadClient,
  requireClient,
  async ctx => {
    await AccountController.list(ctx)
  })

router.get('/:provider',
  loadClient,
  requireClient,
  loadAccount,
  requireAccount,
  ctx => {
    AccountController.get(ctx)
  })

router.delete('/:provider',
  loadClient,
  requireClient,
  loadAccount,
  requireAccount,
  async ctx => {
    await AccountController.delete(ctx)
  })

export default router
