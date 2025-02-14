import { Context, Status, createHttpError } from '@oak/oak'
import urlToFields from '../../utils/transformers/url-to/fields.ts'
import TableRepository from './repository.ts'
import sendJSON from '../../utils/send-json.ts'
import tableToTableResponse from '../../utils/transformers/table-to/table-response.ts'

class TableController {
  private static repository: TableRepository

  constructor () {
    TableController.getRepository()
  }

  static getRepository (): TableRepository {
    if (!TableController.repository) TableController.repository = new TableRepository()
    return TableController.repository
  }

  static async create (ctx: Context, url?: URL) {
    const fields = urlToFields(url ?? ctx)
    const post = ctx.state.itemCreation
    const saved = await TableController.getRepository().create(post)
    if (!saved?.id) throw createHttpError(Status.InternalServerError)

    const full = await TableController.getRepository().get(saved.id)
    if (full === null) throw createHttpError(Status.InternalServerError)
    sendJSON(ctx, tableToTableResponse(full, fields))
  }

  static get (ctx: Context, url?: URL) {
    const fields = urlToFields(url ?? ctx)
    sendJSON(ctx, tableToTableResponse(ctx.state.table, fields))
  }
}

export default TableController
