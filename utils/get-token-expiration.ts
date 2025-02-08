import intervalToMs from './transformers/interval-to/ms.ts'

const getTokenExpiration = (): Date => {
  const interval = Deno.env.get('TOKEN_EXPIRATION') ?? '10 minutes'
  return new Date(Date.now() + intervalToMs(interval))
}

export default getTokenExpiration
