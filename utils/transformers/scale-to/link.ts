import type Scale from '../../../types/scale.ts'
import getRoot from '../../get-root.ts'

const scaleToLink = (scale: Scale): string => {
  const root = getRoot()
  const collection = 'scales'
  const id = scale.slug ?? scale.id
  const path = id ? [root, collection, id] : [root, collection]
  return path.join('/')
}

export default scaleToLink
