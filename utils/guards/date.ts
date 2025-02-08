const isDateOrUndefined = (value: unknown): value is Date | undefined => {
  if (value === undefined) return true
  return value instanceof Date && !isNaN(value.getTime())
}

export default isDateOrUndefined
