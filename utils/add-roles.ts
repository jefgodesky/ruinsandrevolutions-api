import type User from '../types/user.ts'
import RoleRepository from '../collections/users/roles/repository.ts'

const addRoles = async (user: User): Promise<User> => {
  const repository = new RoleRepository()
  const roles = user.id ? await repository.get(user.id) ?? [] : []
  return {
    ...user,
    roles
  }
}

export default addRoles
