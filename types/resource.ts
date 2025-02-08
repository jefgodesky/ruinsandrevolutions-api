import AuthTokenResource, { isAuthTokenResource } from './auth-token-resource.ts'
import ProviderResource, { isProviderResource } from './provider-resource.ts'
import ScaleResource, { isScaleResource } from './scale-resource.ts'
import UserResource, { createUserResource, isUserResource } from './user-resource.ts'

type Resource =
  AuthTokenResource |
  ProviderResource |
  ScaleResource |
  UserResource

const createResource = (overrides?: Partial<Resource>): Resource => {
  const defaultResource: Resource = createUserResource()
  return { ...defaultResource, ...overrides } as Resource
}

const isResource = (candidate: unknown): candidate is Resource => {
  if (isAuthTokenResource(candidate)) return true
  if (isProviderResource(candidate)) return true
  if (isScaleResource(candidate)) return true
  return isUserResource(candidate)
}

export default Resource
export {
  createResource,
  isResource
}
