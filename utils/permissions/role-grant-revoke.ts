import { Context } from '@oak/oak'
import checkExplicitPermission from './explicit.ts'

const checkRoleGrantRevokePermission = (ctx: Context, permission: string): boolean => {
  const role = ctx.state.params?.role
  if (!role) return false

  const instance = permission.replace('role:', `role:${role}:`)
  return checkExplicitPermission(ctx, instance)
}

export default checkRoleGrantRevokePermission
