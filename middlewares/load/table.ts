import { Middleware } from '@oak/oak'
import TableRepository from '../../collections/tables/repository.ts'

const loadTable: Middleware = async (ctx, next) => {
  const tables = new TableRepository()
  ctx.state.table = await tables.get(ctx.state.params.tableId)
  await next()
}

export default loadTable
