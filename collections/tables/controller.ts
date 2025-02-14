import { Context, Status, createHttpError } from '@oak/oak'
import type TablePatch from '../../types/table-patch.ts'
import urlToFields from '../../utils/transformers/url-to/fields.ts'
import TableRepository from './repository.ts'
import sendJSON from '../../utils/send-json.ts'
import sendNoContent from '../../utils/send-no-content.ts'
import tableToTableResponse from '../../utils/transformers/table-to/table-response.ts'
import tablesToTablePageResponse from '../../utils/transformers/table-to/table-page-response.ts'
import getNumberFromQueryString from '../../utils/get-number-from-query-string.ts'
import urlToItemSorting from '../../utils/transformers/url-to/item-sorting.ts'
import urlToItemFiltering from '../../utils/transformers/url-to/item-filtering.ts'
import patchTable from '../../utils/patching/table.ts'

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

  static async list (ctx: Context, url?: URL) {
    const src = url ?? ctx.request.url
    const limit = getNumberFromQueryString(src, 'limit')
    const offset = getNumberFromQueryString(src, 'offset')
    const fields = urlToFields(src)
    const sort = urlToItemSorting(src)
    const { query, params } = urlToItemFiltering(src)

    const where = query.length > 0 ? query : undefined
    const { total, rows } = await TableController.getRepository().list(limit, offset, where, sort, params)
    const res = tablesToTablePageResponse(rows, total, offset ?? 0, limit, fields)
    sendJSON(ctx, res)
  }

  static async update (ctx: Context, url?: URL) {
    const src = url ?? ctx.request.url
    const fields = urlToFields(src)
    const patch = await ctx.request.body.json() as TablePatch
    const patched = patchTable(ctx.state.table, patch)
    const updated = await TableController.getRepository().update(patched)
    if (updated === null) throw createHttpError(Status.InternalServerError)
    const res = tableToTableResponse(updated, fields)
    sendJSON(ctx, res)
  }

  static async delete (ctx: Context) {
    const { id } = ctx.state.table
    await TableController.getRepository().delete(id)
    sendNoContent(ctx)
  }
}

export default TableController
