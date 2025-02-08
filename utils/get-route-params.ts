const getRouteParams = (path: string, regex: RegExp, paramNames: (string | number)[]): Record<string, string> => {
  const match = path.match(regex)
  if (!match) return {}

  const data: Record<string, string> = {}
  const params = match.slice(1)
  const len = Math.min(params.length, paramNames.length)
  for (let i = 0; i < len; i++) {
    data[paramNames[i]] = params[i]
  }

  return data
}

export default getRouteParams
