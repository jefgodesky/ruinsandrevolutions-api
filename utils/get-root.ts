import getEnvNumber from './get-env-number.ts'

const getRoot = (): string => {
  const protocol = Deno.env.get('API_PROTOCOL') ?? 'https'
  const domain = Deno.env.get('API_DOMAIN') ?? 'api.example.com'
  const port = getEnvNumber('PORT', 80)
  const version = getEnvNumber('API_VERSION', 1)

  return port === 80
    ? `${protocol}://${domain}/v${version}`
    : `${protocol}://${domain}:${port}/v${version}`
}

export default getRoot
