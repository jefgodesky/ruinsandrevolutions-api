import { describe, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import intervalToMs from './ms.ts'

describe('intervalToMs', () => {
  it('returns 0 if given a string it does not understand', () => {
    expect(intervalToMs('Hello, world!')).toBe(0)
    expect(intervalToMs('3 months')).toBe(0)
    expect(intervalToMs('3 years')).toBe(0)
    expect(intervalToMs('2 decades')).toBe(0)
  })

  it('returns the number of milliseconds in 1 second', () => {
    expect(intervalToMs('1 second')).toBe(1000)
  })

  it('returns the number of milliseconds in 2 seconds', () => {
    expect(intervalToMs('2 seconds')).toBe(2 * 1000)
  })

  it('returns the number of milliseconds in 10 seconds', () => {
    expect(intervalToMs('10 seconds')).toBe(10 * 1000)
  })

  it('returns the number of milliseconds in 1 minute', () => {
    expect(intervalToMs('1 minute')).toBe(60 * 1000)
  })

  it('returns the number of milliseconds in 2 minutes', () => {
    expect(intervalToMs('2 minutes')).toBe(2 * 60 * 1000)
  })

  it('returns the number of milliseconds in 10 minutes', () => {
    expect(intervalToMs('10 minutes')).toBe(10 * 60 * 1000)
  })

  it('returns the number of milliseconds in 1 hour', () => {
    expect(intervalToMs('1 hour')).toBe(60 * 60 * 1000)
  })

  it('returns the number of milliseconds in 2 hours', () => {
    expect(intervalToMs('2 hours')).toBe(2 * 60 * 60 * 1000)
  })

  it('returns the number of milliseconds in 10 hours', () => {
    expect(intervalToMs('10 hours')).toBe(10 * 60 * 60 * 1000)
  })

  it('returns the number of milliseconds in 1 day', () => {
    expect(intervalToMs('1 day')).toBe(24 * 60 * 60 * 1000)
  })

  it('returns the number of milliseconds in 2 days', () => {
    expect(intervalToMs('2 days')).toBe(2 * 24 * 60 * 60 * 1000)
  })

  it('returns the number of milliseconds in 10 days', () => {
    expect(intervalToMs('10 days')).toBe(10 * 24 * 60 * 60 * 1000)
  })

  it('returns the number of milliseconds in 1 week', () => {
    expect(intervalToMs('1 week')).toBe(7 * 24 * 60 * 60 * 1000)
  })

  it('returns the number of milliseconds in 2 weeks', () => {
    expect(intervalToMs('2 weeks')).toBe(2 * 7 * 24 * 60 * 60 * 1000)
  })

  it('returns the number of milliseconds in 10 weeks', () => {
    expect(intervalToMs('10 weeks')).toBe(10 * 7 * 24 * 60 * 60 * 1000)
  })

  it('can handle floats', () => {
    const est = 12 * 60 * 60
    expect(intervalToMs('0.5 days')).toBeGreaterThan((est - 30) * 1000)
    expect(intervalToMs('0.5 days')).toBeLessThan((est + 30) * 1000)
  })
})
