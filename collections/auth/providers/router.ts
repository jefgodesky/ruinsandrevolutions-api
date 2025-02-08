import { Router } from '@oak/oak'
import type ProviderResource from '../../../types/provider-resource.ts'
import { PROVIDERS } from '../../../types/provider.ts'

import getJSONAPI from '../../../utils/get-jsonapi.ts'
import getRoot from '../../../utils/get-root.ts'
import sendJSON from '../../../utils/send-json.ts'

const router = new Router({
  prefix: '/providers'
})

router.get('/', ctx => {
  const providers: ProviderResource[] = []
  for (const id of Object.values(PROVIDERS)) {
    providers.push({ type: 'provider', id })
  }

  sendJSON(ctx, {
    jsonapi: getJSONAPI(),
    links: {
      self: getRoot() + '/auth/providers',
      describedBy: getRoot() + '/docs'
    },
    data: providers
  })
})

export default router
