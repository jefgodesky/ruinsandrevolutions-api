import type User from '../../../types/user.ts'
import getRoot from '../../get-root.ts'

const userToRelLink = (user: User, rel: string): string => {
  const endpoint = user.id ? `/users/${user.id}/relationships/${rel}` : '/users'
  return getRoot() + endpoint
}

export default userToRelLink
