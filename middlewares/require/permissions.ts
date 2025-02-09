import { Context, Middleware, Next, Status, createHttpError } from '@oak/oak'
import checkOmniPermission from '../../utils/permissions/omni.ts'
import checkUserSelfPermission from '../../utils/permissions/user-self.ts'
import checkRoleSelfPermission from '../../utils/permissions/role-self.ts'
import checkRoleGrantRevokePermission from '../../utils/permissions/role-grant-revoke.ts'
import checkItemAuthorPermission from '../../utils/permissions/item-author.ts'
import checkExplicitPermission from '../../utils/permissions/explicit.ts'
import getMessage from '../../utils/get-message.ts'

const requirePermissions = (...permissions: string[]): Middleware => {
  return async (ctx: Context, next: Next) => {
    const omni = checkOmniPermission(ctx)
    const checks = permissions.map(permission => {
      if (omni) return true
      return [
        checkUserSelfPermission(ctx, permission),
        checkRoleGrantRevokePermission(ctx, permission),
        checkRoleSelfPermission(ctx, permission),
        checkItemAuthorPermission(ctx, permission),
        checkExplicitPermission(ctx, permission)
      ].some(check => check === true)
    })

    if (checks.every(check => check === true)) {
      await next()
    } else if (ctx.state.client !== undefined) {
      throw createHttpError(Status.Forbidden, getMessage('lack_permissions'))
    } else {
      throw createHttpError(Status.Unauthorized, getMessage('authentication_required'))
    }
  }
}

export default requirePermissions
