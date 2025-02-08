import Links, { isLinks } from './links.ts'
import getRoot from '../utils/get-root.ts'
import hasAllProperties from '../utils/has-all-properties.ts'

export default interface PaginatedLinks extends Links {
  first: string
  prev: string
  next: string
  last: string
}

const createPaginatedLinks = (overrides?: Partial<PaginatedLinks>): PaginatedLinks => {
  const defaultPaginatedLinks: PaginatedLinks = {
    self: getRoot() + '/tests',
    first: getRoot() + '/tests?offset=0&limit=10',
    prev: getRoot() + '/tests?offset=10&limit=10',
    next: getRoot() + '/tests?offset=30&limit=10',
    last: getRoot() + '/tests?offset=40&limit=10',
  }

  return { ...defaultPaginatedLinks, ...overrides }
}

const isPaginatedLinks = (candidate: unknown): candidate is PaginatedLinks => {
  if (!isLinks(candidate)) return false
  return hasAllProperties(candidate, ['first', 'prev', 'next', 'last'])
}

export {
  createPaginatedLinks,
  isPaginatedLinks
}
