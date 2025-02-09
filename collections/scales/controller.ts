import { Context, Status, createHttpError } from '@oak/oak'
import type ScaleCreation from '../../types/scale-creation.ts'
import ScaleRepository from './repository.ts'
import sendJSON from '../../utils/send-json.ts'
import scaleToScaleResponse from '../../utils/transformers/scale-to/scale-response.ts'

class ScaleController {
  static async create (ctx: Context) {
    const repository = new ScaleRepository()
    const post = await ctx.request.body.json() as ScaleCreation
    const saved = await repository.create(post)
    if (saved === null) throw createHttpError(Status.InternalServerError)
    sendJSON(ctx, scaleToScaleResponse(saved))
  }
}

export default ScaleController
