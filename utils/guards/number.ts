const isNumberOrUndefined = (value: unknown): value is string | undefined => {
  if (value === undefined) return true
  return typeof value === 'number' && !isNaN(value)
}

export default isNumberOrUndefined
