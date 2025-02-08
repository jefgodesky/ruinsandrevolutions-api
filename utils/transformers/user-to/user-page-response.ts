import type Fields from '../../../types/fields.ts'
import type Response from '../../../types/response.ts'
import type User from '../../../types/user.ts'
import getEnvNumber from '../../get-env-number.ts'
import getRoot from '../../get-root.ts'
import getJSONAPI from '../../get-jsonapi.ts'
import addPaginationLinks from '../../add-pagination-links.ts'
import userToUserResource from './user-resource.ts'

const usersToUserPageResponse = (
  users: User[],
  total: number,
  offset: number,
  limit: number = getEnvNumber('DEFAULT_PAGE_SIZE', 10),
  fields?: Fields
): Response => {
  const self = getRoot() + '/users'
  const links = addPaginationLinks({ self }, self, total, offset, limit)
  const data = users.map(user => userToUserResource(user, fields))
  return {
    jsonapi: getJSONAPI(),
    links,
    data
  }
}

export default usersToUserPageResponse
