import { validateJWT } from '@cross/jwt'
import type ProviderID from '../../types/provider-id.ts'
import { PROVIDERS } from '../../types/provider.ts'
import readableStreamToObject from '../transformers/readable-stream-to/object.ts'

const fetchGoogleKeys = async (): Promise<Array<CryptoKey>> => {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/certs')
  const body = res.body
    ? await readableStreamToObject(res.body) as { keys: Array<object> }
    : { keys: [] }
  const jwks = body.keys

  const keys: CryptoKey[] = []
  for (const jwk of jwks) {
    const key = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      true,
      ['verify']
    )
    keys.push(key)
  }

  return keys
}

const verifyGoogleToken = async (token: string): Promise<ProviderID | false> => {
  const keys = await fetchGoogleKeys()
  for (const key of keys) {
    try {
      const data = await validateJWT(token, key, { validateExp: true })
      if (data) {
        return {
          provider: PROVIDERS.GOOGLE,
          name: data.name,
          pid: data.sub ?? ''
        }
      }
    // deno-lint-ignore no-empty
    } catch {}
  }

  return false
}

export default verifyGoogleToken
