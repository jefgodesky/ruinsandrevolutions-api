import getRoleConfig from './get-role-config.ts'

const getRolePermissions = (role: string = 'anonymous'): string[] => {
  const { roles } = getRoleConfig()
  return (role !== undefined && role in roles) ? roles[role] : []
}

export default getRolePermissions
