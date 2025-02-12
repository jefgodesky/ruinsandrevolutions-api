import type Scroll from '../../types/scroll.ts'
import type ScrollCreation from '../../types/scroll-creation.ts'
import type User from '../../types/user.ts'
import ItemRepository from '../items/repository.ts'
import scrollCreationToItemRecord from '../../utils/transformers/scroll-creation-to/item-record.ts'
import scrollToItemRecord from '../../utils/transformers/scroll-to/item-record.ts'
import itemRecordAndAuthorsToScroll from '../../utils/transformers/item-record-and-authors-to/scroll.ts'
import getEnvNumber from '../../utils/get-env-number.ts'

const DEFAULT_PAGE_SIZE = getEnvNumber('DEFAULT_PAGE_SIZE', 10)

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

  async list (
    limit: number = DEFAULT_PAGE_SIZE,
    offset: number = 0,
    where: string = 'TRUE',
    sort: string = 'i.updated DESC',
    params: string[] = []
  ): Promise<{ total: number, rows: Scroll[] }> {
    params.push('scroll')
    where = where + ` AND i.type = $${params.length}`

    const repository = new ItemRepository()
    const { total, rows } = await repository.list(limit, offset, where, sort, params)
    const scrolls = rows.map(row => itemRecordAndAuthorsToScroll(row, row.authors))
    return { total, rows: scrolls }
  }

  async update (scroll: Scroll): Promise<Scroll | null> {
    if (!scroll.id) return null
    const repository = new ItemRepository()
    const res = await repository.update(scrollToItemRecord(scroll), scroll.authors)
    if (res === null) return null
    return await this.get(scroll.id)
  }
}
