import type Scroll from '../../../types/scroll.ts'
import getRoot from '../../get-root.ts'

const scrollToLink = (scroll: Scroll): string => {
  const root = getRoot()
  const collection = 'scrolls'
  const id = scroll.slug ?? scroll.id
  const path = id ? [root, collection, id] : [root, collection]
  return path.join('/')
}

export default scrollToLink
