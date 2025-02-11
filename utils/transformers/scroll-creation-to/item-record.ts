import type ItemRecord from '../../../types/item-record.ts'
import type ScrollCreation from '../../../types/scroll-creation.ts'

const scrollCreationToItemRecord = (post: ScrollCreation): ItemRecord => {
  const { name, slug, description, body, attribution, start, notes, created, updated } = post.data.attributes
  const type = 'scroll'
  const data = JSON.parse(JSON.stringify({ start, notes }))
  return { type, name, slug, description, body, attribution, data, created, updated }
}

export default scrollCreationToItemRecord
