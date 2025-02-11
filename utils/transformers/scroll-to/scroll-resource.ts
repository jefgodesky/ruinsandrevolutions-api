import type Fields from '../../../types/fields.ts'
import type Scroll from '../../../types/scroll.ts'
import type ScrollResource from '../../../types/scroll-resource.ts'
import scrollToScrollAttributes from './scroll-attributes.ts'

const scrollToScrollResource = (scroll: Scroll, fields?: Fields): ScrollResource => {
  const id = scroll.id ?? 'ERROR'
  return {
    type: 'scrolls',
    id,
    attributes: scrollToScrollAttributes(scroll, fields),
    relationships: {
      authors: {
        data: scroll.authors.map(author => ({ type: 'users', id: author.id ?? 'ERROR' }))
      }
    }
  }
}

export default scrollToScrollResource
