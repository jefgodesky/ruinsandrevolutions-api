import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import readableStreamToString from '../readable-stream-to/string.ts'
import stringToReadableStream from './readable-stream.ts'

describe('stringToReadableStream', () => {
  const greeting = 'Hello, world!'

  it('returns a readable stream', async () => {
    const stream = stringToReadableStream(greeting)
    const back = await readableStreamToString(stream)
    expect(typeof stream).not.toBe('string')
    expect(back).toEqual(greeting)
  })
})
