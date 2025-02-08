import type JSONAPI from '../types/json-api.ts'

const getJSONAPI = (): JSONAPI => {
  return { version: '1.1' }
}

export default getJSONAPI
