import { Middleware } from '@oak/oak'
import { isScaleCreation } from '../../types/scale-creation.ts'

const loadItemCreation: Middleware = async (ctx, next) => {
  const body = await ctx.request.body.json()
  const tests = [
    isScaleCreation(body)
  ]

  if (tests.some(test => test === true)) ctx.state.itemCreation = body
  await next()
}

export default loadItemCreation
