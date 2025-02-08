const isParam = (str: string, param: string, accepted: string[]): boolean => {
  if (!str.startsWith(`${param}=`)) return false
  const val = str.substring(param.length + 1)
  return accepted.map(v => `"${v}"`).includes(val)
}

const isValidMediaType = (str: string): boolean => {
  const profiles: string[] = []
  const extensions: string[] = []
  const expected = 'application/vnd.api+json'
  if (!str.startsWith(expected)) return false

  const parts = str.split(';')
  for (const part of parts) {
    if (part === expected) continue
    const profile = isParam(part, 'profile', profiles)
    const extension = isParam(part, 'ext', extensions)
    if (!profile && !extension) return false
  }

  return true
}

export default isValidMediaType
export { isParam }
