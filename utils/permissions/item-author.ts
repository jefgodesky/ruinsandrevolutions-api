import * as uuid from '@std/uuid'
import { Context } from '@oak/oak'
import type Item from '../../types/item.ts'
import { itemTypes } from '../../types/item-record.ts'
import checkExplicitPermission from './explicit.ts'

const checkItemAuthorPermission = (ctx: Context, permission: string): boolean => {
  const id = ctx.state.client?.id ?? 'ERROR'
  if (!uuid.v4.validate(id)) return false

  const itemType = itemTypes.find(t => permission.startsWith(t))
  if (!itemType) return false

  const item = ctx.state[itemType] as Item | undefined
  if (!item) return false

  const authorVersion = permission.replace(`${itemType}:`, `${itemType}:author:`)
  const authorIDs = item.authors.map(author => author.id ?? 'ERROR')
  const isAuthor = authorIDs.includes(id)
  return isAuthor && checkExplicitPermission(ctx, authorVersion)
}

export default checkItemAuthorPermission
