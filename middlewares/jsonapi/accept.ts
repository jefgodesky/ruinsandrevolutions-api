import { Middleware, Status, createHttpError } from '@oak/oak'
import isValidMediaType from '../../utils/is-valid-media-type.ts'
import getMessage from '../../utils/get-message.ts'

const enforceJsonApiAccept: Middleware = async (ctx, next) => {
  const accept = ctx.request.headers.get('Accept')
  let unacceptable = false

  if (accept) {
    const types = accept.split(',').map(t => t.trim())
    unacceptable = !types.some(t => isValidMediaType(t) || t === '*/*')
  }

  if (unacceptable) throw createHttpError(Status.NotAcceptable, getMessage('jsonapi_enforce_accept'))
  await next()
}

export default enforceJsonApiAccept
