const addToQuery = (orig: string, add: string): string => {
  const conj = orig.indexOf('?') > -1 ? '&' : '?'
  return orig + conj + add
}

export default addToQuery
