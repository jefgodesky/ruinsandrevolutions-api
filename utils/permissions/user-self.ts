import { Context } from '@oak/oak'
import checkExplicitPermission from './explicit.ts'
import isSelf from '../is-self.ts'

const checkUserSelfPermission = (ctx: Context, permission: string): boolean => {
  const selfVersion = permission.replace('user:', 'user:self:')
  return isSelf(ctx) && checkExplicitPermission(ctx, selfVersion)
}

export default checkUserSelfPermission
