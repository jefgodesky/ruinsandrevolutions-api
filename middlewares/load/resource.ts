import { Middleware } from '@oak/oak'
import loadAccount from './account.ts'
import loadScale from './scale.ts'
import loadScroll from './scroll.ts'
import loadTable from './table.ts'
import loadUser from './user.ts'

const loadResource: Middleware = async (ctx, next) => {
  const { client, params } = ctx.state

  if (client && params?.provider) await loadAccount(ctx, async () => {})
  if (params?.scaleId) await loadScale(ctx, async () => {})
  if (params?.scrollId) await loadScroll(ctx, async () => {})
  if (params?.tableId) await loadTable(ctx, async () => {})
  if (params?.userId) await loadUser(ctx, async () => {})

  await next()
}

export default loadResource
