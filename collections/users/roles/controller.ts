import { Context } from '@oak/oak'
import RoleRepository from './repository.ts'
import sendNoContent from '../../../utils/send-no-content.ts'

class RoleController {
  static async grant (ctx: Context) {
    const { uid, role } = RoleController.getUIDRoleFromContext(ctx)
    const repository = new RoleRepository()
    const check = await repository.has(uid, role)
    if (check !== true) await repository.grant(uid, role)
    sendNoContent(ctx)
  }

  static async revoke (ctx: Context) {
    const { uid, role } = RoleController.getUIDRoleFromContext(ctx)
    const repository = new RoleRepository()
    await repository.revoke(uid, role)
    sendNoContent(ctx)
  }

  private static getUIDRoleFromContext (ctx: Context): { uid: string, role: string } {
    const { user, params } = ctx.state
    const { role } = params
    return { uid: user.id, role }
  }
}

export default RoleController
