const isNumberArray = (value: unknown): value is number[] => {
  return Array.isArray(value) && value.every(item => typeof item === 'number')
}

export default isNumberArray
