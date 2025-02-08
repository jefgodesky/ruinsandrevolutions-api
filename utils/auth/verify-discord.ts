import type ProviderID from '../../types/provider-id.ts'
import { PROVIDERS } from '../../types/provider.ts'
import readableStreamToObject from '../transformers/readable-stream-to/object.ts'

const verifyDiscordToken = async (token: string): Promise<ProviderID | false> => {
  const res = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = res.status === 200 && res.body
    // deno-lint-ignore no-explicit-any
    ? await readableStreamToObject(res.body) as Record<string, any>
    : null
  await res.body?.cancel()
  if (!data) return false

  return {
    provider: PROVIDERS.DISCORD,
    name: data.username,
    pid: data.id
  }
}

export default verifyDiscordToken
