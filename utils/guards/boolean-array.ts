const isBooleanArray = (value: unknown): value is boolean[] => {
  return Array.isArray(value) && value.every(item => typeof item === 'boolean')
}

export default isBooleanArray
