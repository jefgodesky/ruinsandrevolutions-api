import type ItemRecord from '../../../types/item-record.ts'
import type Note from '../../../types/note.ts'
import type RandomizedString from '../../../types/randomized-string.ts'
import type Scroll from '../../../types/scroll.ts'

const scrollToItemRecord = (scroll: Scroll): ItemRecord => {
  const data: { start: RandomizedString, notes?: Note[] } = { start: scroll.start }
  if (scroll.notes) data.notes = scroll.notes

  return {
    id: scroll.id,
    type: 'scroll',
    name: scroll.name,
    slug: scroll.slug,
    description: scroll.description,
    body: scroll.body,
    attribution: scroll.attribution,
    data: JSON.parse(JSON.stringify(data)),
    created: scroll.created,
    updated: scroll.updated
  }
}

export default scrollToItemRecord
