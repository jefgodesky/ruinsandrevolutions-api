const isBooleanOrUndefined = (value: unknown): value is boolean | undefined => {
  if (value === undefined) return true
  return typeof value === 'boolean'
}

export default isBooleanOrUndefined
