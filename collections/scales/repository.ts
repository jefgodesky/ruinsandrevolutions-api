import type Scale from '../../types/scale.ts'
import type ScaleCreation from '../../types/scale-creation.ts'
import type User from '../../types/user.ts'
import ItemRepository from '../items/repository.ts'
import scaleCreationToItemRecord from '../../utils/transformers/scale-creation-to/item-record.ts'
import itemRecordAndAuthorsToScale from '../../utils/transformers/item-record-and-authors-to/scale.ts'

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
}
