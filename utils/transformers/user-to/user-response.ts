import type Fields from '../../../types/fields.ts'
import type User from '../../../types/user.ts'
import type Response from '../../../types/response.ts'
import getJSONAPI from '../../get-jsonapi.ts'
import getRoot from '../../get-root.ts'
import userToLink from './link.ts'
import userToUserResource from './user-resource.ts'

const userToUserResponse = (user: User, fields?: Fields): Response => {
  return {
    jsonapi: getJSONAPI(),
    links: {
      self: userToLink(user),
      describedBy: getRoot() + '/docs'
    },
    data: userToUserResource(user, fields)
  }
}

export default userToUserResponse
