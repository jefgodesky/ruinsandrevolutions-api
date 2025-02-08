const getAllFieldCombinations = <T extends object>(full: T): Array<Partial<T>> => {
  const fields = Object.keys(full) as Array<keyof T>
  const combinations: Array<Partial<T>> = []

  const total = 1 << fields.length
  for (let i = 0; i < total; i++) {
    const combination: Partial<T> = {}
    fields.forEach((field, index) => {
      if (i & (1 << index)) {
        combination[field] = full[field]
      }
    })
    combinations.push(combination)
  }

  return combinations
}

export default getAllFieldCombinations
