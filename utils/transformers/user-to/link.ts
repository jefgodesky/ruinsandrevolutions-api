import type User from '../../../types/user.ts'
import getRoot from '../../get-root.ts'

const userToLink = (user: User): string => {
  const endpoint = user.id ? `/users/${user.id}` : '/users'
  return getRoot() + endpoint
}

export default userToLink
