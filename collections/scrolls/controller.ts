import { Context, Status, createHttpError } from '@oak/oak'
import urlToFields from '../../utils/transformers/url-to/fields.ts'
import ScrollRepository from './repository.ts'
import sendJSON from '../../utils/send-json.ts'
import scrollToScrollResponse from '../../utils/transformers/scroll-to/scroll-response.ts'

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
}

export default ScrollController
