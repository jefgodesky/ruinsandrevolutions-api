import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import isValidMediaType, { isParam } from './is-valid-media-type.ts'

describe('isValidMediaType', () => {
  it('rejects non-MIME strings', () => {
    expect(isValidMediaType('lol nope')).toBe(false)
  })

  it('rejects other MIME types', () => {
    const types = [
      'application/epub+zip',
      'application/json',
      'application/ld+json',
      'application/gzip',
      'application/msword',
      'application/octet-stream',
      'application/pdf',
      'image/vnd.microsoft.icon',
      'application/vnd.ms-fontobject',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'audio/midi',
      'audio/mpeg',
      'image/avif',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/webp',
      'text/calendar',
      'text/css',
      'text/csv',
      'text/html',
      'text/javascript',
      'text/plain',
      'video/mp4',
      'video/mpeg',
      'video/webm',
    ]
    for (const t of types) expect(isValidMediaType(t)).toBe(false)
  })

  it('accepts application/vnd.api+json', () => {
    expect(isValidMediaType('application/vnd.api+json')).toBe(true)
  })

  it('rejects anything with a profile', () => {
    const t = 'application/vnd.api+json;profile="https://example.com/resource-timestamps"'
    expect(isValidMediaType(t)).toBe(false)
  })

  it('rejects anything with an extension', () => {
    const t = 'application/vnd.api+json;ext="https://jsonapi.org/ext/version"'
    expect(isValidMediaType(t)).toBe(false)
  })

  it('rejects anything with any other parameters', () => {
    const t = 'application/vnd.api+json;other="hello"'
    expect(isValidMediaType(t)).toBe(false)
  })
})

describe('isParam (isValidMediaType helper)', () => {
  it('returns false if string doesn\'t start with param', () => {
    expect(isParam('test', 'p', [])).toBe(false)
  })

  it('returns false if there are no accepted values', () => {
    expect(isParam('p="test"', 'p', [])).toBe(false)
  })

  it('returns false if value is not in accepted values', () => {
    expect(isParam('p="test"', 'p', ['other'])).toBe(false)
  })

  it('returns true if value is in accepted values', () => {
    expect(isParam('p="test"', 'p', ['test'])).toBe(true)
  })
})
