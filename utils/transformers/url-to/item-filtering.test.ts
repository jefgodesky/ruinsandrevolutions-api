import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import urlToItemFiltering, {
  itemFilterStringFields,
  itemFilterAuthorFields,
  itemFilterDateFields
} from './item-filtering.ts'

describe('urlToItemFiltering', () => {
  it('returns a null string and empty array if it has no filtering', () => {
    const url = new URL(`https://example.com/v1/items?this=1&that=2`)
    const { query, params } = urlToItemFiltering(url)
    expect(query).toBe('')
    expect(params).toEqual([])
  })

  it('captures exact filtering for basic strings', () => {
    for (const s of itemFilterStringFields) {
      const url = new URL(`https://example.com/v1/items?this=1&filter[${s}]=test&that=2`)
      const { query, params } = urlToItemFiltering(url)
      expect(query).toBe(`i.${s} = $1`)
      expect(params).toEqual(['test'])
    }
  })

  it('captures startsWith filtering for basic strings', () => {
    for (const s of itemFilterStringFields) {
      const url = new URL(`https://example.com/v1/items?this=1&filter[${s}][startsWith]=test&that=2`)
      const { query, params } = urlToItemFiltering(url)
      expect(query).toBe(`i.${s} LIKE $1`)
      expect(params).toEqual(['test%'])
    }
  })

  it('captures endsWith filtering for basic strings', () => {
    for (const s of itemFilterStringFields) {
      const url = new URL(`https://example.com/v1/items?this=1&filter[${s}][endsWith]=test&that=2`)
      const { query, params } = urlToItemFiltering(url)
      expect(query).toBe(`i.${s} LIKE $1`)
      expect(params).toEqual(['%test'])
    }
  })

  it('captures contains filtering for basic strings', () => {
    for (const s of itemFilterStringFields) {
      const url = new URL(`https://example.com/v1/items?this=1&filter[${s}][contains]=test&that=2`)
      const { query, params } = urlToItemFiltering(url)
      expect(query).toBe(`i.${s} ILIKE $1`)
      expect(params).toEqual(['%test%'])
    }
  })

  it('captures comma-separated fields for basic strings', () => {
    const url = new URL('https://example.com/v1/items?this=1&filter[description,notes][contains]=test&that=2')
    const { query, params } = urlToItemFiltering(url)
    expect(query).toBe('i.description ILIKE $1 AND i.notes ILIKE $2')
    expect(params).toEqual(['%test%', '%test%'])
  })

  it('captures exact filtering for author strings', () => {
    for (const a of itemFilterAuthorFields) {
      const url = new URL(`https://example.com/v1/items?this=1&filter[${a}]=test&that=2`)
      const { query, params } = urlToItemFiltering(url)
      expect(query).toBe(`u.${a.substring('author.'.length)} = $1`)
      expect(params).toEqual(['test'])
    }
  })

  it('captures startsWith filtering for author strings', () => {
    for (const a of itemFilterAuthorFields) {
      const url = new URL(`https://example.com/v1/items?this=1&filter[${a}][startsWith]=test&that=2`)
      const { query, params } = urlToItemFiltering(url)
      expect(query).toBe(`u.${a.substring('author.'.length)} LIKE $1`)
      expect(params).toEqual(['test%'])
    }
  })

  it('captures endsWith filtering for author strings', () => {
    for (const a of itemFilterAuthorFields) {
      const url = new URL(`https://example.com/v1/items?this=1&filter[${a}][endsWith]=test&that=2`)
      const { query, params } = urlToItemFiltering(url)
      expect(query).toBe(`u.${a.substring('author.'.length)} LIKE $1`)
      expect(params).toEqual(['%test'])
    }
  })

  it('captures contains filtering for author strings', () => {
    for (const a of itemFilterAuthorFields) {
      const url = new URL(`https://example.com/v1/items?this=1&filter[${a}][contains]=test&that=2`)
      const { query, params } = urlToItemFiltering(url)
      expect(query).toBe(`u.${a.substring('author.'.length)} ILIKE $1`)
      expect(params).toEqual(['%test%'])
    }
  })

  it('captures comma-separated fields for author strings', () => {
    const url = new URL('https://example.com/v1/items?this=1&filter[author.name,author.username][contains]=test&that=2')
    const { query, params } = urlToItemFiltering(url)
    expect(query).toBe('u.name ILIKE $1 AND u.username ILIKE $2')
    expect(params).toEqual(['%test%', '%test%'])
  })

  it('captures comma-separated fields for basic and author strings', () => {
    const url = new URL('https://example.com/v1/items?this=1&filter[name,author.name][contains]=test&that=2')
    const { query, params } = urlToItemFiltering(url)
    expect(query).toBe('i.name ILIKE $1 AND u.name ILIKE $2')
    expect(params).toEqual(['%test%', '%test%'])
  })

  it('captures exact filtering for dates', () => {
    for (const s of itemFilterDateFields) {
      const date = new Date().toISOString()
      const url = new URL(`https://example.com/v1/items?this=1&filter[${s}]=${date}&that=2`)
      const { query, params } = urlToItemFiltering(url)
      expect(query).toBe(`i.${s} = $1`)
      expect(params).toEqual([date])
    }
  })

  it('captures a range for dates', () => {
    for (const s of itemFilterDateFields) {
      const startDay = '2025-01-01'
      const endDay = '2025-01-31'
      const start = new Date(`${startDay}T00:00:00.000Z`).toISOString().substring(0, 21)
      const end = new Date(`${endDay}T23:59:59.999Z`).toISOString().substring(0, 21)
      const url = new URL(`https://example.com/v1/items?this=1&filter[${s}]=${startDay}...${endDay}&that=2`)
      const { query, params } = urlToItemFiltering(url)
      expect(query).toBe(`i.${s} >= $1 AND i.${s} <= $2`)
      expect(params[0].startsWith(start)).toBe(true)
      expect(params[1].startsWith(end)).toBe(true)
    }
  })

  it('captures relative durations', () => {
    for (const s of itemFilterDateFields) {
      const end = new Date()
      const start = new Date(end.getTime() - (24 * 60 * 60 * 1000))
      const url = new URL(`https://example.com/v1/items?this=1&filter[${s}]=P1D&that=2`)
      const { query, params } = urlToItemFiltering(url)
      expect(query).toBe(`i.${s} >= $1 AND i.${s} <= $2`)
      expect(new Date(params[0]).getTime() / 1000).toBeCloseTo(start.getTime() / 1000, 1)
      expect(new Date(params[1]).getTime() / 1000).toBeCloseTo(end.getTime() / 1000, 1)
    }
  })

  it('can combine date, string, and author fields', () => {
    const end = new Date()
    const start = new Date(end.getTime() - (24 * 60 * 60 * 1000))
    const url = new URL(`https://example.com/v1/items?this=1&filter[created]=P1D&filter[name,author.name]=test&that=2`)
    const { query, params } = urlToItemFiltering(url)

    expect(query).toBe(`i.created >= $1 AND i.created <= $2 AND i.name = $3 AND u.name = $4`)
    expect(new Date(params[0]).getTime() / 1000).toBeCloseTo(start.getTime() / 1000, 1)
    expect(new Date(params[1]).getTime() / 1000).toBeCloseTo(end.getTime() / 1000, 1)
    expect(params[2]).toBe('test')
    expect(params[3]).toBe('test')
  })

  it('ignores invalid fields', () => {
    const url = new URL('https://example.com/v1/items?this=1&filter[nope][contains]=test&that=2')
    const { query, params } = urlToItemFiltering(url)
    expect(query).toBe('')
    expect(params).toEqual([])
  })

  it('ignores invalid types', () => {
    const url = new URL('https://example.com/v1/items?this=1&filter[created][contains]=test&that=2')
    const { query, params } = urlToItemFiltering(url)
    expect(query).toBe('')
    expect(params).toEqual([])
  })
})
