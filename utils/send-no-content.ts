import { type Context, Status } from '@oak/oak'

const sendNoContent = (ctx: Context): void => {
  ctx.response.status = Status.NoContent
  ctx.response.type = undefined
}

export default sendNoContent
