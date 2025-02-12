import { Context, Status, createHttpError } from '@oak/oak'
import urlToFields from '../../utils/transformers/url-to/fields.ts'
import ScrollRepository from './repository.ts'
import sendJSON from '../../utils/send-json.ts'
import scrollToScrollResponse from '../../utils/transformers/scroll-to/scroll-response.ts'
import scrollsToScrollPageResponse from '../../utils/transformers/scroll-to/scroll-page-response.ts'
import getNumberFromQueryString from '../../utils/get-number-from-query-string.ts'
import urlToItemSorting from '../../utils/transformers/url-to/item-sorting.ts'
import urlToItemFiltering from '../../utils/transformers/url-to/item-filtering.ts'

class ScrollController {
  private static repository: ScrollRepository

  constructor () {
    ScrollController.getRepository()
  }

  static getRepository (): ScrollRepository {
    if (!ScrollController.repository) ScrollController.repository = new ScrollRepository()
    return ScrollController.repository
  }

  static async create (ctx: Context, url?: URL) {
    const fields = urlToFields(url ?? ctx)
    const post = ctx.state.itemCreation
    const saved = await ScrollController.getRepository().create(post)
    if (!saved?.id) throw createHttpError(Status.InternalServerError)

    const full = await ScrollController.getRepository().get(saved.id)
    if (full === null) throw createHttpError(Status.InternalServerError)
    sendJSON(ctx, scrollToScrollResponse(full, fields))
  }

  static get (ctx: Context, url?: URL) {
    const fields = urlToFields(url ?? ctx)
    sendJSON(ctx, scrollToScrollResponse(ctx.state.scroll, fields))
  }

  static async list (ctx: Context, url?: URL) {
    const src = url ?? ctx.request.url
    const limit = getNumberFromQueryString(src, 'limit')
    const offset = getNumberFromQueryString(src, 'offset')
    const fields = urlToFields(src)
    const sort = urlToItemSorting(src)
    const { query, params } = urlToItemFiltering(src)

    const where = query.length > 0 ? query : undefined
    const { total, rows } = await ScrollController.getRepository().list(limit, offset, where, sort, params)
    const res = scrollsToScrollPageResponse(rows, total, offset ?? 0, limit, fields)
    sendJSON(ctx, res)
  }
}

export default ScrollController
