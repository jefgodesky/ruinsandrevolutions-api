import intervalToMs from './transformers/interval-to/ms.ts'

const getRefreshExpiration = (): Date => {
  const interval = Deno.env.get('REFRESH_EXPIRATION') ?? '7 days'
  return new Date(Date.now() + intervalToMs(interval))
}

export default getRefreshExpiration
