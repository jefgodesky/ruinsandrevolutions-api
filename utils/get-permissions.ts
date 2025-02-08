import type User from '../types/user.ts'
import addRoles from './add-roles.ts'
import getRolePermissions from './get-role-permissions.ts'

const getPermissions = async (user?: User): Promise<string[]> => {
  if (user && !user.roles) user = await addRoles(user)
  const roles = user?.roles ?? []
  let all = await getRolePermissions()

  for (const role of roles) {
    const rolePermissions = await getRolePermissions(role)
    all = [...all, ...rolePermissions]
  }

  return [...new Set(all)]
}

export default getPermissions
