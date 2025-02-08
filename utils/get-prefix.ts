import getEnvNumber from './get-env-number.ts'

const getPrefix = (collection?: string): string => {
  const version = getEnvNumber('API_VERSION', 1)
  const v = `/v${version}`
  return collection ? [v, collection].join('/') : v
}

export default getPrefix
