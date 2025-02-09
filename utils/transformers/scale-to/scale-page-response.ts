import type Fields from '../../../types/fields.ts'
import type Response from '../../../types/response.ts'
import type Scale from '../../../types/scale.ts'
import getEnvNumber from '../../get-env-number.ts'
import getRoot from '../../get-root.ts'
import getJSONAPI from '../../get-jsonapi.ts'
import addPaginationLinks from '../../add-pagination-links.ts'
import userToIncludedResource from '../user-to/included-resource.ts'
import removeDuplicateResources from '../../remove-duplicate-resources.ts'
import scaleToScaleResource from './scale-resource.ts'

const scalesToScalePageResponse = (
  scales: Scale[],
  total: number,
  offset: number,
  limit: number = getEnvNumber('DEFAULT_PAGE_SIZE', 10),
  fields?: Fields
): Response => {
  const self = getRoot() + '/scales'
  const links = addPaginationLinks({ self }, self, total, offset, limit)
  const data = scales.map(scale => scaleToScaleResource(scale, fields))
  const included = scales.map(scale => scale.authors.map(author => userToIncludedResource(author, fields))).flat()
  return {
    jsonapi: getJSONAPI(),
    links,
    data,
    included: removeDuplicateResources(included)
  }
}

export default scalesToScalePageResponse
