import { Context } from '@oak/oak'
import checkExplicitPermission from './explicit.ts'
import isSelf from '../is-self.ts'

const checkRoleSelfPermission = (ctx: Context, permission: string): boolean => {
  if (ctx.state?.params?.role === undefined) return false
  const { role } = ctx.state.params
  const selfVersion = permission.replace('role:', `role:self:${role}:`)
  return isSelf(ctx) && checkExplicitPermission(ctx, selfVersion)
}

export default checkRoleSelfPermission
