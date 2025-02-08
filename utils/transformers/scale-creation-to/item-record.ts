import type ItemRecord from '../../../types/item-record.ts'
import type ScaleCreation from '../../../types/scale-creation.ts'

const scaleCreationToItemRecord = (post: ScaleCreation): ItemRecord => {
  const { name, slug, description, body, attribution, levels, created, updated } = post.data.attributes
  const type = 'scale'
  const data = levels
  return { type, name, slug, description, body, attribution, data, created, updated }
}

export default scaleCreationToItemRecord
