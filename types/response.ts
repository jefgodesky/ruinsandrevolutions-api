import JSONAPI from './json-api.ts'
import ErrorObject from './error-object.ts'
import Links, { createLinks } from './links.ts'
import Resource, { createResource } from './resource.ts'
import getJSONAPI from '../utils/get-jsonapi.ts'

export default interface Response {
  jsonapi: JSONAPI
  links: Links
  data?: Resource | Resource[]
  errors?: ErrorObject[]
  included?: Resource[]
}

const createResponse = (overrides?: Partial<Response>): Response => {
  const defaultResponse: Response = {
    jsonapi: getJSONAPI(),
    links: createLinks(),
    data: createResource()
  }

  return { ...defaultResponse, ...overrides }
}

export { createResponse }
