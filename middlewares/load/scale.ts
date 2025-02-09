import { Middleware } from '@oak/oak'
import ScaleRepository from '../../collections/scales/repository.ts'

const loadScale: Middleware = async (ctx, next) => {
  const scales = new ScaleRepository()
  ctx.state.scale = await scales.get(ctx.state.params.scaleId)
  await next()
}

export default loadScale
