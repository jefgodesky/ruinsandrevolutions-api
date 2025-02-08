import { type Context, Status } from '@oak/oak'
import type Response from '../types/response.ts'

const sendJSON = (ctx: Context, content: Response): void => {
  ctx.response.status = Status.OK
  ctx.response.type = 'application/vnd.api+json'
  ctx.response.body = content
}

export default sendJSON
