import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getPaginationQueries from './get-pagination-queries.ts'

describe('getPaginationQueries', () => {
  it('handles an empty set', () => {
    const queries = getPaginationQueries(0, 0, 10)
    expect(queries.first).toBe('offset=0&limit=10')
    expect(queries.prev).toBe('offset=0&limit=10')
    expect(queries.next).toBe('offset=0&limit=10')
    expect(queries.last).toBe('offset=0&limit=10')
  })

  it('handles a set with just one page', () => {
    const queries = getPaginationQueries(8, 0, 10)
    expect(queries.first).toBe('offset=0&limit=10')
    expect(queries.prev).toBe('offset=0&limit=10')
    expect(queries.next).toBe('offset=0&limit=10')
    expect(queries.last).toBe('offset=0&limit=10')
  })

  it('handles the first page of a set', () => {
    const queries = getPaginationQueries(175, 0, 10)
    expect(queries.first).toBe('offset=0&limit=10')
    expect(queries.prev).toBe('offset=0&limit=10')
    expect(queries.next).toBe('offset=10&limit=10')
    expect(queries.last).toBe('offset=170&limit=10')
  })

  it('handles the x+1 page of a set', () => {
    const queries = getPaginationQueries(175, 30, 10)
    expect(queries.first).toBe('offset=0&limit=10')
    expect(queries.prev).toBe('offset=20&limit=10')
    expect(queries.next).toBe('offset=40&limit=10')
    expect(queries.last).toBe('offset=170&limit=10')
  })

  it('handles weird offsets', () => {
    const queries = getPaginationQueries(175, 42, 10)
    expect(queries.first).toBe('offset=0&limit=10')
    expect(queries.prev).toBe('offset=30&limit=10')
    expect(queries.next).toBe('offset=50&limit=10')
    expect(queries.last).toBe('offset=170&limit=10')
  })

  it('handles the last page of a set', () => {
    const queries = getPaginationQueries(175, 172, 10)
    expect(queries.first).toBe('offset=0&limit=10')
    expect(queries.prev).toBe('offset=160&limit=10')
    expect(queries.next).toBe('offset=170&limit=10')
    expect(queries.last).toBe('offset=170&limit=10')
  })

  it('isn\'t thrown off by off-by-one errors', () => {
    const queries = getPaginationQueries(6, 3, 1)
    expect(queries.first).toBe('offset=0&limit=1')
    expect(queries.prev).toBe('offset=2&limit=1')
    expect(queries.next).toBe('offset=4&limit=1')
    expect(queries.last).toBe('offset=5&limit=1')
  })
})
