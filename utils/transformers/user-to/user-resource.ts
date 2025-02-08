import type Fields from '../../../types/fields.ts'
import type User from '../../../types/user.ts'
import type UserResource from '../../../types/user-resource.ts'
import userToUserAttributes from './user-attributes.ts'

const userToUserResource = (user: User, fields?: Fields): UserResource => {
  return {
    type: 'users',
    id: user.id ?? 'ERROR',
    attributes: userToUserAttributes(user, fields)
  }
}

export default userToUserResource
