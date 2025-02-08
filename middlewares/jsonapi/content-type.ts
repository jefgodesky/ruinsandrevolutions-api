import { Middleware, Status, createHttpError } from '@oak/oak'
import isValidMediaType from '../../utils/is-valid-media-type.ts'
import getMessage from '../../utils/get-message.ts'

const enforceJsonApiContentType: Middleware = async (ctx, next) => {
  const contentType = ctx.request.headers.get('Content-Type')
  if (contentType && !isValidMediaType(contentType)) throw createHttpError(Status.UnsupportedMediaType, getMessage('jsonapi_enforce_content_type'))
  await next()
}

export default enforceJsonApiContentType
