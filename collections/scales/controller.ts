import { Context, Status, createHttpError } from '@oak/oak'
import type ScaleCreation from '../../types/scale-creation.ts'
import urlToFields from '../../utils/transformers/url-to/fields.ts'
import ScaleRepository from './repository.ts'
import sendJSON from '../../utils/send-json.ts'
import scaleToScaleResponse from '../../utils/transformers/scale-to/scale-response.ts'

class ScaleController {
  static async create (ctx: Context, url?: URL) {
    const repository = new ScaleRepository()
    const fields = urlToFields(url ?? ctx)
    const post = await ctx.request.body.json() as ScaleCreation
    const saved = await repository.create(post)
    if (!saved?.id) throw createHttpError(Status.InternalServerError)

    const full = await repository.get(saved.id)
    if (full === null) throw createHttpError(Status.InternalServerError)
    sendJSON(ctx, scaleToScaleResponse(full, fields))
  }

  static get (ctx: Context, url?: URL) {
    const fields = urlToFields(url ?? ctx)
    sendJSON(ctx, scaleToScaleResponse(ctx.state.scale, fields))
  }
}

export default ScaleController
