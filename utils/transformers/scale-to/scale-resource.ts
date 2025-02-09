import type Fields from '../../../types/fields.ts'
import type Scale from '../../../types/scale.ts'
import type ScaleResource from '../../../types/scale-resource.ts'
import scaleToScaleAttributes from './scale-attributes.ts'

const scaleToScaleResource = (scale: Scale, fields?: Fields): ScaleResource => {
  const id = scale.id ?? 'ERROR'
  return {
    type: 'scales',
    id,
    attributes: scaleToScaleAttributes(scale, fields),
    relationships: {
      authors: {
        data: scale.authors.map(author => ({ type: 'users', id: author.id ?? 'ERROR' }))
      }
    }
  }
}

export default scaleToScaleResource
