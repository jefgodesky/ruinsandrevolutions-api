import type Scale from '../../types/scale.ts'
import type ScaleCreation from '../../types/scale-creation.ts'
import type User from '../../types/user.ts'
import ItemRepository from '../items/repository.ts'
import scaleToItemRecord from '../../utils/transformers/scale-to/item-record.ts'
import scaleCreationToItemRecord from '../../utils/transformers/scale-creation-to/item-record.ts'
import itemRecordAndAuthorsToScale from '../../utils/transformers/item-record-and-authors-to/scale.ts'
import getEnvNumber from '../../utils/get-env-number.ts'

const DEFAULT_PAGE_SIZE = getEnvNumber('DEFAULT_PAGE_SIZE', 10)

export default class ScaleRepository {
  async create (post: ScaleCreation): Promise<Scale | null> {
    const repository = new ItemRepository()
    const data = post.data.relationships?.authors?.data
    const authors = (Array.isArray(data) ? data : [data])
      .filter(a => a !== undefined)
      .map(resource => ({ id: resource.id, name: '' } as User))
    const record = await repository.save(scaleCreationToItemRecord(post), authors)
    return record === null
      ? null
      : itemRecordAndAuthorsToScale(record, authors)
  }

  async get (id: string): Promise<Scale | null> {
    const repository = new ItemRepository()
    const record = await repository.getByIdOrSlug('scale', id)
    if (record === null) return null
    return itemRecordAndAuthorsToScale(record, record.authors)
  }

  async list (
    limit: number = DEFAULT_PAGE_SIZE,
    offset: number = 0,
    where: string = 'TRUE',
    sort: string = 'i.updated DESC',
    params: string[] = []
  ): Promise<{ total: number, rows: Scale[] }> {
    params.push('scale')
    where = where + ` AND i.type = $${params.length}`

    const repository = new ItemRepository()
    const { total, rows } = await repository.list(limit, offset, where, sort, params)
    const scales = rows.map(row => itemRecordAndAuthorsToScale(row, row.authors))
    return { total, rows: scales }
  }

  async update (scale: Scale): Promise<Scale | null> {
    if (!scale.id) return null
    const repository = new ItemRepository()
    const res = await repository.update(scaleToItemRecord(scale), scale.authors)
    if (res === null) return null
    return await this.get(scale.id)
  }

  async delete (id: string): Promise<void> {
    const repository = new ItemRepository()
    return await repository.delete(id)
  }
}
