import isObject from '../utils/guards/object.ts'
import isStringOrUndefined from '../utils/guards/string.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface RandomizedString {
  human: string
  computable?: string
}

const createRandomizedString = (overrides?: Partial<RandomizedString>): RandomizedString => {
  return {
    human: overrides?.human ?? '2d6 + Intelligence',
    computable: overrides?.computable ?? '{{2d6 + Intelligence}}'
  }
}

const isRandomizedString = (candidate: unknown): candidate is RandomizedString => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>

  if (typeof obj.human !== 'string') return false
  if (!isStringOrUndefined(obj.computable)) return false
  return hasNoOtherProperties(obj, ['human', 'computable'])
}

export {
  createRandomizedString,
  isRandomizedString
}
