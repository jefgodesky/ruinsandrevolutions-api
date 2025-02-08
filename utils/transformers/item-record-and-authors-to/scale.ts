import type ItemRecord from '../../../types/item-record.ts'
import type Scale from '../../../types/scale.ts'
import type User from '../../../types/user.ts'
import isStringArray from '../../guards/string-array.ts'

const itemRecordAndAuthorsToScale = (record: ItemRecord, authors: User[]): Scale => {
  return {
    id: record.id ?? 'ERROR',
    name: record.name,
    slug: record.slug,
    description: record.description,
    body: record.body,
    attribution: record.attribution,
    authors,
    levels: isStringArray(record.data) ? record.data : [],
    created: record.created,
    updated: record.updated
  }
}

export default itemRecordAndAuthorsToScale
