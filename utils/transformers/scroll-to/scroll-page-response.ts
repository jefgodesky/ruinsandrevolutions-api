import type Fields from '../../../types/fields.ts'
import type Response from '../../../types/response.ts'
import type Scroll from '../../../types/scroll.ts'
import getEnvNumber from '../../get-env-number.ts'
import getRoot from '../../get-root.ts'
import getJSONAPI from '../../get-jsonapi.ts'
import addPaginationLinks from '../../add-pagination-links.ts'
import userToIncludedResource from '../user-to/included-resource.ts'
import removeDuplicateResources from '../../remove-duplicate-resources.ts'
import scrollToScrollResource from './scroll-resource.ts'

const scrollsToScrollPageResponse = (
  scrolls: Scroll[],
  total: number,
  offset: number,
  limit: number = getEnvNumber('DEFAULT_PAGE_SIZE', 10),
  fields?: Fields
): Response => {
  const self = getRoot() + '/scrolls'
  const links = addPaginationLinks({ self }, self, total, offset, limit)
  const data = scrolls.map(scroll => scrollToScrollResource(scroll, fields))
  const included = scrolls.map(scroll => scroll.authors.map(author => userToIncludedResource(author, fields))).flat()
  return {
    jsonapi: getJSONAPI(),
    links,
    data,
    included: removeDuplicateResources(included)
  }
}

export default scrollsToScrollPageResponse
