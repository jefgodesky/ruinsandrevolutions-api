import type ProviderResource from '../../../types/provider-resource.ts'
import type Response from '../../../types/response.ts'
import getJSONAPI from '../../get-jsonapi.ts'
import getRoot from '../../get-root.ts'

const providerResourcesToResponse = (data: ProviderResource | ProviderResource[]): Response => {
  return {
    jsonapi: getJSONAPI(),
    links: {
      self: getRoot() + '/accounts',
      describedBy: getRoot() + '/docs'
    },
    data
  }
}

export default providerResourcesToResponse
