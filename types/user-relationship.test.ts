import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getRoot from '../utils/get-root.ts'
import { isUserRelationship } from './user-relationship.ts'

describe('isUserRelationship', () => {
  const id = crypto.randomUUID()

  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isUserRelationship(primitive)).toBe(false)
    }
  })

  it('returns true if given a single user resource', () => {
    expect(isUserRelationship({ data: { type: 'users', id } })).toBe(true)
  })

  it('returns true if given an array of user resources', () => {
    expect(isUserRelationship({ data: [{ type: 'users', id }] })).toBe(true)
  })

  it('returns true with links', () => {
    const links = { self: getRoot() + '/tests' }
    expect(isUserRelationship({ links, data: [{ type: 'users', id }] })).toBe(true)
  })

  it('returns false if the data is not a user', () => {
    expect(isUserRelationship({ data: { type: 'nope', id } })).toBe(false)
  })

  it('returns false if any of the data resources are not users', () => {
    expect(isUserRelationship({ data: [{ type: 'nope', id }] })).toBe(false)
  })

  it('returns false if given additional properties', () => {
    expect(isUserRelationship({ data: { type: 'nope', id }, other: true })).toBe(false)
  })
})
