import { Context } from '@oak/oak'
import getRoleConfig from '../get-role-config.ts'

const checkExplicitPermission = (ctx: Context, permission: string): boolean => {
  const granted = ctx.state.permissions ?? getRoleConfig().roles.anonymous
  return granted.includes(permission)
}

export default checkExplicitPermission
