import type ItemRecord from '../../../types/item-record.ts'
import type Scale from '../../../types/scale.ts'

const scaleToItemRecord = (scale: Scale): ItemRecord => {
  return {
    id: scale.id,
    type: 'scale',
    name: scale.name,
    slug: scale.slug,
    description: scale.description,
    body: scale.body,
    attribution: scale.attribution,
    data: scale.levels,
    created: scale.created,
    updated: scale.updated
  }
}

export default scaleToItemRecord
