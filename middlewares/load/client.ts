import { Middleware } from '@oak/oak'
import { validateJWT } from '@cross/jwt'
import RoleRepository from '../../collections/users/roles/repository.ts'
import getJWTSecret from '../../utils/get-jwt-secret.ts'
import getPermissions from '../../utils/get-permissions.ts'

const loadClient: Middleware = async (ctx, next) => {
  const auth = ctx.request.headers.get('Authorization')
  const jwt = auth === null || !auth.startsWith('Bearer ')
    ? null
    : auth.substring(7)
  try {
    const roles = new RoleRepository()
    const token = jwt === null ? null : await validateJWT(jwt, getJWTSecret(), { validateExp: true })
    const check = token?.user?.id !== undefined && await roles.has(token?.user?.id, 'active')
    if (check) ctx.state.client = token.user
    // deno-lint-ignore no-empty
  } catch {}

  ctx.state.permissions = await getPermissions(ctx.state.client)
  await next()
}

export default loadClient
