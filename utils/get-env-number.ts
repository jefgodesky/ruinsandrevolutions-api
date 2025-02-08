const getEnvNumber = (varname: string, fallback: number = 0): number => {
  const str = Deno.env.get(varname)
  if (str === undefined) return fallback
  const parsed = parseInt(str)
  return isNaN(parsed) ? fallback : parsed
}

export default getEnvNumber
