import type Table from '../../types/table.ts'
import type TableCreation from '../../types/table-creation.ts'
import type User from '../../types/user.ts'
import ItemRepository from '../items/repository.ts'
import tableCreationToItemRecord from '../../utils/transformers/table-creation-to/item-record.ts'
import tableToItemRecord from '../../utils/transformers/table-to/item-record.ts'
import itemRecordAndAuthorsToTable from '../../utils/transformers/item-record-and-authors-to/table.ts'
import getEnvNumber from '../../utils/get-env-number.ts'

const DEFAULT_PAGE_SIZE = getEnvNumber('DEFAULT_PAGE_SIZE', 10)


export default class TableRepository {
  async create (post: TableCreation): Promise<Table | null> {
    const repository = new ItemRepository()
    const data = post.data.relationships?.authors?.data
    const authors = (Array.isArray(data) ? data : [data])
      .filter(a => a !== undefined)
      .map(resource => ({ id: resource.id, name: '' } as User))
    const record = await repository.save(tableCreationToItemRecord(post), authors)
    return record === null
      ? null
      : itemRecordAndAuthorsToTable(record, authors)
  }

  async get (id: string): Promise<Table | null> {
    const repository = new ItemRepository()
    const record = await repository.getByIdOrSlug('table', id)
    if (record === null) return null
    return itemRecordAndAuthorsToTable(record, record.authors)
  }

  async list (
    limit: number = DEFAULT_PAGE_SIZE,
    offset: number = 0,
    where: string = 'TRUE',
    sort: string = 'i.updated DESC',
    params: string[] = []
  ): Promise<{ total: number, rows: Table[] }> {
    params.push('table')
    where = where + ` AND i.type = $${params.length}`

    const repository = new ItemRepository()
    const { total, rows } = await repository.list(limit, offset, where, sort, params)
    const tables = rows.map(row => itemRecordAndAuthorsToTable(row, row.authors))
    return { total, rows: tables }
  }

  async update (table: Table): Promise<Table | null> {
    if (!table.id) return null
    const repository = new ItemRepository()
    const res = await repository.update(tableToItemRecord(table), table.authors)
    if (res === null) return null
    return await this.get(table.id)
  }
}
