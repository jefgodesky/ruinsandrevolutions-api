import type Account from '../../../types/account.ts'
import type ProviderResource from '../../../types/provider-resource.ts'

const accountToProviderResource = (account: Account): ProviderResource => {
  return {
    type: 'provider',
    id: account.provider
  }
}

export default accountToProviderResource
