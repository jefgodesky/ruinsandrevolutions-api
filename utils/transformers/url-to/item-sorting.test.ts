import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import urlToItemSorting from './item-sorting.ts'

describe('urlToItemSorting', () => {
  it('returns undefined when no fields are specified', () => {
    const url = new URL('http://localhost:8001/v1/items')
    expect(urlToItemSorting(url)).toBeUndefined()
  })

  it('returns the sorting options specified', () => {
    const scenarios = [
      ['name', 'i.name ASC'],
      ['-name', 'i.name DESC'],
      ['created', 'i.created ASC'],
      ['-created', 'i.created DESC'],
      ['updated', 'i.updated ASC'],
      ['-updated', 'i.updated DESC'],
      ['name,-updated,-created', 'i.name ASC, i.updated DESC, i.created DESC'],
      ['name,other', 'i.name ASC'],
    ]

    for (const [q, order] of scenarios) {
      const url = new URL(`https://example.com/v1/items?this=1&sort=${q}&that=2`)
      const actual = urlToItemSorting(url)
      expect(actual).toEqual(order)
    }
  })
})
