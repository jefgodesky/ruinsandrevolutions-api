import type Fields from '../../../types/fields.ts'
import type Scroll from '../../../types/scroll.ts'
import type Response from '../../../types/response.ts'
import getJSONAPI from '../../get-jsonapi.ts'
import getRoot from '../../get-root.ts'
import scrollToLink from './link.ts'
import scrollToScrollResource from './scroll-resource.ts'
import userToIncludedResource from '../user-to/included-resource.ts'

const scrollToScrollResponse = (scroll: Scroll, fields?: Fields): Response => {
  return {
    jsonapi: getJSONAPI(),
    links: {
      self: scrollToLink(scroll),
      describedBy: getRoot() + '/docs'
    },
    data: scrollToScrollResource(scroll, fields),
    included: scroll.authors.map(author => userToIncludedResource(author, fields))
  }
}

export default scrollToScrollResponse
