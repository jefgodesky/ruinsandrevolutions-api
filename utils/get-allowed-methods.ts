import { Router } from '@oak/oak'

const getAllowedMethods = (path: string, routers: Record<string, Router>): string[] => {
  let methods: string[] = []
  for (const router of Object.values(routers)) {
    for (const route of router.values()) {
      if (path.match(route.regexp)) {
        methods = [...methods, ...route.methods]
      }
    }
  }
  return methods
}

export default getAllowedMethods
