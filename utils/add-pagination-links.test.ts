import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getRoot from './get-root.ts'
import addPaginationLinks from './add-pagination-links.ts'

describe('addPaginationLinks', () => {
  const base = `${getRoot()}/tests`

  it('adds pagination links for an empty set', () => {
    const links = { self: `${base}` }
    const paginated = addPaginationLinks(links, base, 0, 0, 10)
    expect(paginated.first).toBe(`${base}?offset=0&limit=10`)
    expect(paginated.prev).toBe(`${base}?offset=0&limit=10`)
    expect(paginated.next).toBe(`${base}?offset=0&limit=10`)
    expect(paginated.last).toBe(`${base}?offset=0&limit=10`)
  })

  it('handles a set with just one page', () => {
    const links = { self: `${base}?offset=0&limit=10` }
    const paginated = addPaginationLinks(links, base, 8, 0, 10)
    expect(paginated.first).toBe(`${base}?offset=0&limit=10`)
    expect(paginated.prev).toBe(`${base}?offset=0&limit=10`)
    expect(paginated.next).toBe(`${base}?offset=0&limit=10`)
    expect(paginated.last).toBe(`${base}?offset=0&limit=10`)
  })

  it('handles the first page of a set', () => {
    const links = { self: `${base}?offset=0&limit=10` }
    const paginated = addPaginationLinks(links, base, 175, 0, 10)
    expect(paginated.first).toBe(`${base}?offset=0&limit=10`)
    expect(paginated.prev).toBe(`${base}?offset=0&limit=10`)
    expect(paginated.next).toBe(`${base}?offset=10&limit=10`)
    expect(paginated.last).toBe(`${base}?offset=170&limit=10`)
  })

  it('handles the x+1 page of a set', () => {
    const links = { self: `${base}?offset=30&limit=10` }
    const paginated = addPaginationLinks(links, base, 175, 30, 10)
    expect(paginated.first).toBe(`${base}?offset=0&limit=10`)
    expect(paginated.prev).toBe(`${base}?offset=20&limit=10`)
    expect(paginated.next).toBe(`${base}?offset=40&limit=10`)
    expect(paginated.last).toBe(`${base}?offset=170&limit=10`)
  })

  it('handles weird offsets', () => {
    const links = { self: `${base}?offset=42&limit=10` }
    const paginated = addPaginationLinks(links, base, 175, 42, 10)
    expect(paginated.first).toBe(`${base}?offset=0&limit=10`)
    expect(paginated.prev).toBe(`${base}?offset=30&limit=10`)
    expect(paginated.next).toBe(`${base}?offset=50&limit=10`)
    expect(paginated.last).toBe(`${base}?offset=170&limit=10`)
  })

  it('handles the last page of a set', () => {
    const links = { self: `${base}?offset=172&limit=10` }
    const paginated = addPaginationLinks(links, base, 175, 172, 10)
    expect(paginated.first).toBe(`${base}?offset=0&limit=10`)
    expect(paginated.prev).toBe(`${base}?offset=160&limit=10`)
    expect(paginated.next).toBe(`${base}?offset=170&limit=10`)
    expect(paginated.last).toBe(`${base}?offset=170&limit=10`)
  })
})
