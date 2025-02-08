import { Context, Middleware, Next, Status } from '@oak/oak'
import { createHttpError } from 'jsr:@oak/commons@1/http_errors'
import RoleRepository from '../../../collections/users/roles/repository.ts'
import getMessage from '../../../utils/get-message.ts'

const requireUserRole = (role: string): Middleware => {
  return async (ctx: Context, next: Next) => {
    const roles = new RoleRepository()
    const uid = ctx.state.user?.id ?? null
    const check = uid ? await roles.has(uid, role) : false

    if (check) {
      await next()
    } else {
      throw createHttpError(Status.NotFound, getMessage('user_not_found'))
    }
  }
}

export default requireUserRole
