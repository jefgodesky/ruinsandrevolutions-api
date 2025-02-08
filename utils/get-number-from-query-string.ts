const getNumberFromQueryString = (url: URL, param: string): number | undefined => {
  const str = url.searchParams.get(param)
  if (!str) return undefined
  const num = parseInt(str)
  return isNaN(num) ? undefined : num
}

export default getNumberFromQueryString
