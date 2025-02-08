import LinkObject from './link-object.ts'
import getRoot from '../utils/get-root.ts'
import isObject from '../utils/guards/object.ts'
import { isLinkObject } from './link-object.ts'

export default interface Links {
  self: LinkObject | string
  related?: LinkObject | string
  describedBy?: LinkObject | string
  [key: string]: LinkObject | string | undefined
}

const createLinks = (overrides?: Partial<Links>): Links => {
  const defaultLinks: Links = {
    self: getRoot() + '/test/1',
    describedBy: getRoot() + '/docs'
  }

  return { ...defaultLinks, ...overrides }
}

const isLinks = (candidate: unknown): candidate is Links => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>

  const isStringOrLinkObject = (value: unknown): value is string | LinkObject => {
    if (typeof value === 'string') return true
    return isLinkObject(value)
  }

  if (!isStringOrLinkObject(obj.self)) return false
  return Object.keys(obj).every(key => isStringOrLinkObject(obj[key]))
}

export {
  createLinks,
  isLinks
}
