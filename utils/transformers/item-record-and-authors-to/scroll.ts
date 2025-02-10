import type ItemRecord from '../../../types/item-record.ts'
import type Scroll from '../../../types/scroll.ts'
import type User from '../../../types/user.ts'
import { isRandomizedString } from '../../../types/randomized-string.ts'
import { isNotesArray } from '../../../types/note.ts'

const itemRecordAndAuthorsToScroll = (record: ItemRecord, authors: User[]): Scroll => {
  const data = record.data as Record<string, unknown>
  const start = isRandomizedString(data.start) ? data.start : { human: 'ERROR' }

  const scroll: Scroll = {
    id: record.id ?? 'ERROR',
    name: record.name,
    slug: record.slug,
    description: record.description,
    body: record.body,
    attribution: record.attribution,
    authors,
    start,
    created: record.created,
    updated: record.updated
  }

  if (isNotesArray(data.notes)) scroll.notes = data.notes
  return scroll
}

export default itemRecordAndAuthorsToScroll
