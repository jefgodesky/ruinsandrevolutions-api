import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getRouteParams from './get-route-params.ts'

describe('getRouteParams', () => {
  it('returns an empty object if nothing matches', () => {
    const path = '/v1/lol/nope'
    const regex = /^\/v1\/users(?:\/([^\/#\?]+?))[\/#\?]?$/i
    const actual = getRouteParams(path, regex, ['userId'])
    expect(actual).toEqual({})
  })

  it('populates parameters', () => {
    const path = '/v1/users/test/roles/tester'
    const regex = /^\/v1\/users(?:\/([^\/#\?]+?))\/roles(?:\/([^\/#\?]+?))[\/#\?]?$/i
    const paramNames = ['userId', 'role']
    const actual = getRouteParams(path, regex, paramNames)
    expect(actual).toEqual({ userId: 'test', role: 'tester' })
  })
})
