import { Router, Status, createHttpError } from '@oak/oak'
import AuthTokenController from './controller.ts'
import sendJSON from '../../../utils/send-json.ts'
import requireTokenCreationBody from '../../../middlewares/require/body/token-creation.ts'
import getMessage from '../../../utils/get-message.ts'

const router = new Router({
  prefix: '/tokens'
})

router.post('/', requireTokenCreationBody, async ctx => {
  const body = await ctx.request.body.json()
  const { provider, token } = body.data.attributes
  const res = provider
    ? await AuthTokenController.create(provider, token)
    : await AuthTokenController.refresh(token)
  if (!res) throw createHttpError(Status.BadRequest, getMessage('invalid_auth_token'))
  sendJSON(ctx, res)
})

export default router
