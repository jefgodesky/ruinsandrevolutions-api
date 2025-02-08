import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type JSONAPI from '../types/json-api.ts'
import getJSONAPI from './get-jsonapi.ts'

describe('getJSONAPI', () => {
  it('returns information about the JSON:API version being used', () => {
    const actual = getJSONAPI()
    const expected: JSONAPI = { version: '1.1' }
    expect(actual).toEqual(expected)
  })
})
