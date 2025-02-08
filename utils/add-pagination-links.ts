import type Links from '../types/links.ts'
import type PaginatedLinks from '../types/paginated-links.ts'
import addToQuery from './add-to-query.ts'
import getPaginationQueries from './get-pagination-queries.ts'

import getEnvNumber from './get-env-number.ts'

const addPaginationLinks = (
  orig: Links,
  base: string,
  total: number,
  offset: number,
  limit: number = getEnvNumber('DEFAULT_PAGE_SIZE', 10)
): PaginatedLinks => {
  const queries = getPaginationQueries(total, offset, limit)
  return {
    ...orig,
    first: addToQuery(base, queries.first),
    prev: addToQuery(base, queries.prev),
    next: addToQuery(base, queries.next),
    last: addToQuery(base, queries.last)
  }
}

export default addPaginationLinks
