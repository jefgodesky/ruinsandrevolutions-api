import { Context } from '@oak/oak'
import getRoleConfig from '../get-role-config.ts'

const checkOmniPermission = (ctx: Context): boolean => {
  const permissions = ctx.state.permissions ?? getRoleConfig().roles.anonymous
  return permissions.includes('*')
}

export default checkOmniPermission
