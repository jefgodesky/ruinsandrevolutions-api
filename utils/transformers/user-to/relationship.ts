import type Relationship from '../../../types/relationship.ts'
import type User from '../../../types/user.ts'

const userToRelationship = (user: User | User[], self: string): Relationship => {
  const single = !Array.isArray(user) ? user : user.length === 1 ? user[0] : false
  const type = 'users'
  const data = single
    ? { type, id: single.id ?? 'ERROR' }
    : (user as User[]).map(user => ({ type, id: user.id ?? 'ERROR' }))
  const links = { self }
  return { links, data }
}

export default userToRelationship
