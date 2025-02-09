import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import stringToDates, {
  isISO8601Duration,
  relativeStringToDates,
  dayStringToDates
} from './dates.ts'

describe('isISO8601Duration', () => {
  const valid = ['P3Y', 'P0.5Y', 'P.5Y', 'P0,5Y', 'P,5Y', 'P3M',
    'P0.5M', 'P.5M', 'P0,5M', 'P,5M', 'P3D', 'P0.5D', 'P.5D',
    'P0,5D', 'P,5D', 'PT3H', 'PT0.5H', 'PT.5H', 'PT0,5H', 'PT,5H',
    'PT3M', 'PT0.5M', 'PT.5M', 'PT0,5M', 'PT,5M', 'PT3S', 'PT0.5S',
    'PT.5S', 'PT0,5S', 'PT,5S', 'P1W', 'P0.5W', 'P.5W', 'P0,5W',
    'P,5W', 'P2DT12H', 'P.2Y2M.5DT3H1M35S']
  const invalid = ['P3H', 'P3S', 'P1M2W', 'Probably not', 'nope']

  it('returns false if given an invalid string', () => {
    for (const input of invalid) {
      expect(isISO8601Duration(input)).toBe(false)
    }
  })

  it('returns true if given a valid string', () => {
    for (const input of valid) {
      expect(isISO8601Duration(input)).toBe(true)
    }
  })
})

describe('relativeStringToDates', () => {
  it('returns undefined if not given a valid string', () => {
    const actual = relativeStringToDates('Probably not')
    expect(actual).toBeUndefined()
  })

  it('parses a relative duration in ISO 8601 format', () => {
    const str = 'P3D'
    const end = new Date()
    const start = new Date(end.getTime() - (3 * 24 * 60 * 60 * 1000))
    const actual = relativeStringToDates(str)
    expect(actual![0].getTime() / 1000).toBeCloseTo(start.getTime() / 1000, 1)
    expect(actual![1].getTime() / 1000).toBeCloseTo(end.getTime() / 1000, 1)
  })
})

describe('dayStringToDates', () => {
  it('returns undefined if given an invalid string', () => {
    const actual = dayStringToDates('nope')
    expect(actual).toBeUndefined()
  })

  it('parses a date in ISO 8601 format', () => {
    const str = '2025-01-31'
    const start = new Date(`${str}T00:00:00.000Z`)
    const end = new Date(`${str}T23:59:59.999Z`)
    const actual = dayStringToDates(str)
    expect(actual).toEqual([start, end])
  })
})

describe('stringToDates', () => {
  it('returns undefined if not given a valid string', () => {
    const actual = stringToDates('nope')
    expect(actual).toBeUndefined()
  })

  it('returns undefined if one element in a range is invalid', () => {
    const actual = stringToDates('2025-01-31...nope')
    expect(actual).toBeUndefined()
  })

  it('parses a time in ISO 8601 format', () => {
    const str = '2025-01-31T10:00:00.000Z'
    const date = new Date(str)
    const actual = stringToDates(str)
    expect(actual).toEqual(date)
  })

  it('parses a day in ISO 8601 format', () => {
    const str = '2025-01-31'
    const start = new Date(`${str}T00:00:00.000Z`)
    const end = new Date(`${str}T23:59:59.999Z`)
    const actual = stringToDates(str)
    expect(actual).toEqual([start, end])
  })

  it('parses a range of days in ISO 8601 format', () => {
    const str = '2025-01-01...2025-01-31'
    const start = new Date('2025-01-01T00:00:00.000Z')
    const end = new Date('2025-01-31T23:59:59.999Z')
    const actual = stringToDates(str)
    expect(actual).toEqual([start, end])
  })

  it('parses a range of times in ISO 8601 format', () => {
    const str = '2025-01-01T10:00:00.000Z...2025-01-31T10:00:00.000Z'
    const start = new Date('2025-01-01T10:00:00.000Z')
    const end = new Date('2025-01-31T10:00:00.000Z')
    const actual = stringToDates(str)
    expect(actual).toEqual([start, end])
  })

  it('parses a relative duration in ISO 8601 format', () => {
    const str = 'P3D'
    const end = new Date()
    const start = new Date(end.getTime() - (3 * 24 * 60 * 60 * 1000))
    const actual = stringToDates(str) as [Date, Date]
    expect(actual[0].getTime() / 1000).toBeCloseTo(start.getTime() / 1000, 1)
    expect(actual[1].getTime() / 1000).toBeCloseTo(end.getTime() / 1000, 1)
  })
})
