import { Middleware, Status } from '@oak/oak'
import { createHttpError } from 'jsr:@oak/commons@1/http_errors'
import { isTable } from '../../../types/table.ts'
import getMessage from '../../../utils/get-message.ts'

const requireTable: Middleware = async (ctx, next) => {
  if (!ctx.state.table || !isTable(ctx.state.table)) throw createHttpError(Status.NotFound, getMessage('table_not_found'))
  await next()
}

export default requireTable
