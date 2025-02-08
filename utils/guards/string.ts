const isStringOrUndefined = (value: unknown): value is string | undefined => {
  if (value === undefined) return true
  return typeof value === 'string'
}

export default isStringOrUndefined
