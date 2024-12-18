import { Router } from '@oak/oak'
import AuthTokenController from './controller.ts'
import sendJSON from '../../../utils/responses/send-json.ts'
import { send400, send403 } from '../../../utils/responses/errors.ts'
import requireTokenCreationBody from '../../../middlewares/require/body/token-creation.ts'

const router = new Router({
  prefix: '/tokens'
})

router.post('/', requireTokenCreationBody, async ctx => {
  const body = await ctx.request.body.json()
  const { provider, token } = body.data.attributes
  try {
    const res = provider
      ? await AuthTokenController.create(provider, token)
      : await AuthTokenController.refresh(token)
    if (res) {
      sendJSON(ctx, res)
    } else if (!provider && res === null) {
      send403(ctx)
    } else {
      send400(ctx)
    }
  } catch (_) {
    send400(ctx)
  }
})

export default router
