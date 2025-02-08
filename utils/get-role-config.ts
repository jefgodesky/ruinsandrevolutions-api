import { parse } from '@std/yaml'

interface RoleConfig {
  default: string[]
  roles: {
    [key: string]: string[]
  }
}

const getRoleConfig = (): RoleConfig => {
  const path = '/app/roles/roles.yml'
  const yaml = Deno.readTextFileSync(path)
  return parse(yaml) as RoleConfig
}

export default getRoleConfig
