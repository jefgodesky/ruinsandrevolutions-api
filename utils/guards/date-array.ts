const isDateArray = (value: unknown): value is Date[] => {
  return Array.isArray(value) && value.every(item => item instanceof Date)
}

export default isDateArray
