import { intersect } from '@std/collections'
import type Fields from '../../../types/fields.ts'
import type User from '../../../types/user.ts'
import UserAttributes, { userAttributes } from '../../../types/user-attributes.ts'

const userToUserAttributes = (user: User, fields?: Fields): UserAttributes => {
  const requested = intersect(fields?.users ?? userAttributes, userAttributes)
  const attributes: UserAttributes = {}
  for (const field of requested) attributes[field] = user[field]
  return attributes
}

export default userToUserAttributes
