import getEnvNumber from '../get-env-number.ts'

const getSupertestRoot = (): string => {
  const port = getEnvNumber('PORT', 8001)
  const version = getEnvNumber('API_VERSION', 1)
  return `http://api:${port}/v${version}`
}

export default getSupertestRoot
