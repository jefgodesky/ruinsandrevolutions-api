import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createUserAttributes, userAttributes } from '../../../types/user-attributes.ts'
import getAllFieldCombinations from '../../testing/get-all-field-combinations.ts'
import getRoot from '../../get-root.ts'
import urlToFields from './fields.ts'

describe('urlToFields', () => {
  describe('User fields', () => {
    it('returns public attributes if there is no fields[users] parameter', () => {
      const url = new URL(`${getRoot()}/users`)
      const actual = urlToFields(url)
      expect(actual.users).toEqual(userAttributes)
    })

    it('returns the fields specified', () => {
      const attributes = createUserAttributes()
      const objects = getAllFieldCombinations(attributes)
      for (const object of objects) {
        const fields = Object.keys(object)
        const url = new URL(`${getRoot()}/users?this=1&fields[users]=${fields.join(',')}&that=2`)
        const actual = urlToFields(url)
        expect(actual.users).toEqual(fields)
      }
    })
  })
})
