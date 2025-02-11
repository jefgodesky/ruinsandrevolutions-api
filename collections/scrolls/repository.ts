import type Scroll from '../../types/scroll.ts'
import type ScrollCreation from '../../types/scroll-creation.ts'
import type User from '../../types/user.ts'
import ItemRepository from '../items/repository.ts'
import scrollCreationToItemRecord from '../../utils/transformers/scroll-creation-to/item-record.ts'
import itemRecordAndAuthorsToScroll from '../../utils/transformers/item-record-and-authors-to/scroll.ts'

export default class ScrollRepository {
  async create (post: ScrollCreation): Promise<Scroll | null> {
    const repository = new ItemRepository()
    const data = post.data.relationships?.authors?.data
    const authors = (Array.isArray(data) ? data : [data])
      .filter(a => a !== undefined)
      .map(resource => ({ id: resource.id, name: '' } as User))
    const record = await repository.save(scrollCreationToItemRecord(post), authors)
    return record === null
      ? null
      : itemRecordAndAuthorsToScroll(record, authors)
  }

  async get (id: string): Promise<Scroll | null> {
    const repository = new ItemRepository()
    const record = await repository.getByIdOrSlug('scroll', id)
    if (record === null) return null
    return itemRecordAndAuthorsToScroll(record, record.authors)
  }
}
