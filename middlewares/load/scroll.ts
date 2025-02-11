import { Middleware } from '@oak/oak'
import ScrollRepository from '../../collections/scrolls/repository.ts'

const loadScroll: Middleware = async (ctx, next) => {
  const scrolls = new ScrollRepository()
  ctx.state.scroll = await scrolls.get(ctx.state.params.scrollId)
  await next()
}

export default loadScroll
