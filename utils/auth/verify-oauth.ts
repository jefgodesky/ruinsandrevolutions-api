import type Provider from '../../types/provider.ts'
import type ProviderID from '../../types/provider-id.ts'
import { PROVIDERS } from '../../types/provider.ts'
import verifyGoogleToken from './verify-google.ts'
import verifyDiscordToken from './verify-discord.ts'
import verifyGitHubToken from './verify-github.ts'

const verifyOAuthToken = async (provider: Provider, token: string): Promise<ProviderID | false> => {
  const methods: Record<Provider, (token: string) => Promise<ProviderID | false>> = {
    [PROVIDERS.GOOGLE]: verifyGoogleToken,
    [PROVIDERS.DISCORD]: verifyDiscordToken,
    [PROVIDERS.GITHUB]: verifyGitHubToken
  }
  return await methods[provider](token)
}

export default verifyOAuthToken
