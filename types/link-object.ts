import isObject from '../utils/guards/object.ts'
import isStringOrUndefined from '../utils/guards/string.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface LinkObject {
  href: string
  rel?: string
  describedBy?: string
  title?: string
  type?: string
  hreflang?: string
}

const isLinkObject = (candidate: unknown): candidate is LinkObject => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>
  if (typeof obj.href !== 'string') return false

  const optional = ['rel', 'describedBy', 'title', 'type', 'hreflang']
  const permitted = ['href', ...optional]
  if (!hasNoOtherProperties(obj, permitted)) return false
  return optional.every(key => isStringOrUndefined(obj[key]))
}

export { isLinkObject }
