import type Fields from '../../../types/fields.ts'
import type Scale from '../../../types/scale.ts'
import type Response from '../../../types/response.ts'
import getJSONAPI from '../../get-jsonapi.ts'
import getRoot from '../../get-root.ts'
import scaleToLink from './link.ts'
import scaleToScaleResource from './scale-resource.ts'
import userToIncludedResource from '../user-to/included-resource.ts'

const scaleToScaleResponse = (scale: Scale, fields?: Fields): Response => {
  return {
    jsonapi: getJSONAPI(),
    links: {
      self: scaleToLink(scale),
      describedBy: getRoot() + '/docs'
    },
    data: scaleToScaleResource(scale, fields),
    included: scale.authors.map(author => userToIncludedResource(author, fields))
  }
}

export default scaleToScaleResponse
