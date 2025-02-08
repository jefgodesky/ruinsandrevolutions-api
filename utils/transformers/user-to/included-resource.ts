import type Fields from '../../../types/fields.ts'
import type User from '../../../types/user.ts'
import type UserResource from '../../../types/user-resource.ts'
import userToLink from './link.ts'
import userToUserAttributes from './user-attributes.ts'

const userToIncludedResource = (user: User, fields?: Fields): UserResource => {
  return {
    links: {
      self: userToLink(user)
    },
    type: 'users',
    id: user.id ?? 'ERROR',
    attributes: userToUserAttributes(user, fields)
  }
}

export default userToIncludedResource
