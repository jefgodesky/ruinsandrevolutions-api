import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import stringToReadableStream from '../string-to/readable-stream.ts'
import readableStreamToString from './string.ts'

describe('readableStreamToString', () => {
  const greeting = 'Hello, world!'

  it('returns a string', async () => {
    const stream = stringToReadableStream(greeting)
    const actual = await readableStreamToString(stream)
    expect(typeof actual).toBe('string')
    expect(actual).toEqual(greeting)
  })
})
