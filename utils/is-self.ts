import { Context } from '@oak/oak'

const isSelf = (ctx: Context): boolean => {
  if (ctx.state.client?.id === undefined) return false
  if (ctx.state.user?.id === undefined) return false
  return ctx.state.client.id === ctx.state.user.id
}

export default isSelf
