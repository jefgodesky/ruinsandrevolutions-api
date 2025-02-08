import type { Router } from '@oak/oak'
import type Links from '../../types/links.ts'
import getRoot from '../../utils/get-root.ts'

const getEndpoints = (routers: Record<string, Router>): Links => {
  const links: Links = {
    self: getRoot(),
    describedBy: getRoot() + '/docs'
  }

  for (const endpoint in routers) {
    links[endpoint] = [getRoot(), endpoint].join('/')
  }

  return links
}

export {
  getEndpoints
}
