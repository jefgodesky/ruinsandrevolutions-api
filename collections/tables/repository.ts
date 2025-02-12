import type Table from '../../types/table.ts'
import type TableCreation from '../../types/table-creation.ts'
import type User from '../../types/user.ts'
import ItemRepository from '../items/repository.ts'
import tableCreationToItemRecord from '../../utils/transformers/table-creation-to/item-record.ts'
import itemRecordAndAuthorsToTable from '../../utils/transformers/item-record-and-authors-to/table.ts'

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
}
