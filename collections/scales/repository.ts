import type Scale from '../../types/scale.ts'
import ItemRepository from '../items/repository.ts'
import scaleToItemRecord from '../../utils/transformers/scale-to/item-record.ts'
import itemRecordAndAuthorsToScale from '../../utils/transformers/item-record-and-authors-to/scale.ts'

export default class ScaleRepository {
  async save (scale: Scale): Promise<Scale | null> {
    if (!scale.id) return await this.create(scale)
    return null
  }

  protected async create (scale: Scale): Promise<Scale | null> {
    const repository = new ItemRepository()
    const { authors } = scale
    const record = await repository.save(scaleToItemRecord(scale), authors)
    return record === null
      ? null
      : itemRecordAndAuthorsToScale(record, authors)
  }
}
