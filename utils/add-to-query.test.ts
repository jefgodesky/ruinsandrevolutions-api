import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getRoot from './get-root.ts'
import addToQuery from './add-to-query.ts'

describe('addToQuery', () => {
  it('adds a query string to a URL', () => {
    const base = `${getRoot()}/tests`
    const actual = addToQuery(base, 'this=1&that=2')
    expect(actual).toBe(`${getRoot()}/tests?this=1&that=2`)
  })

  it('appends to an existing querystring', () => {
    const base = `${getRoot()}/tests?prev=y`
    const actual = addToQuery(base, 'this=1&that=2')
    expect(actual).toBe(`${getRoot()}/tests?prev=y&this=1&that=2`)
  })
})
