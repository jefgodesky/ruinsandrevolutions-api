import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createUserResource } from '../types/user-resource.ts'
import removeDuplicateResources from './remove-duplicate-resources.ts'

describe('removeDuplicateResources', () => {
  it('removes duplicate resources', () => {
    const user = createUserResource()
    const actual = removeDuplicateResources([user, user])
    expect(actual).toEqual([user])
  })
})
