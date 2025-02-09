import { Context, Status, createHttpError } from '@oak/oak'
import type ScaleCreation from '../../types/scale-creation.ts'
import urlToFields from '../../utils/transformers/url-to/fields.ts'
import ScaleRepository from './repository.ts'
import sendJSON from '../../utils/send-json.ts'
import urlToItemSorting from '../../utils/transformers/url-to/item-sorting.ts'
import urlToItemFiltering from '../../utils/transformers/url-to/item-filtering.ts'
import scaleToScaleResponse from '../../utils/transformers/scale-to/scale-response.ts'
import scalesToScalePageResponse from '../../utils/transformers/scale-to/scale-page-response.ts'
import getNumberFromQueryString from '../../utils/get-number-from-query-string.ts'

class ScaleController {
  private static repository: ScaleRepository

  constructor () {
    ScaleController.getRepository()
  }

  static getRepository (): ScaleRepository {
    if (!ScaleController.repository) ScaleController.repository = new ScaleRepository()
    return ScaleController.repository
  }

  static async create (ctx: Context, url?: URL) {
    const fields = urlToFields(url ?? ctx)
    const post = await ctx.request.body.json() as ScaleCreation
    const saved = await ScaleController.getRepository().create(post)
    if (!saved?.id) throw createHttpError(Status.InternalServerError)

    const full = await ScaleController.getRepository().get(saved.id)
    if (full === null) throw createHttpError(Status.InternalServerError)
    sendJSON(ctx, scaleToScaleResponse(full, fields))
  }

  static get (ctx: Context, url?: URL) {
    const fields = urlToFields(url ?? ctx)
    sendJSON(ctx, scaleToScaleResponse(ctx.state.scale, fields))
  }

  static async list (ctx: Context, url?: URL) {
    const src = url ?? ctx.request.url
    const limit = getNumberFromQueryString(src, 'limit')
    const offset = getNumberFromQueryString(src, 'offset')
    const fields = urlToFields(src)
    const sort = urlToItemSorting(src)
    const { query, params } = urlToItemFiltering(src)

    const where = query.length > 0 ? query : undefined
    const { total, rows } = await ScaleController.getRepository().list(limit, offset, where, sort, params)
    const res = scalesToScalePageResponse(rows, total, offset ?? 0, limit, fields)
    sendJSON(ctx, res)
  }
}

export default ScaleController
