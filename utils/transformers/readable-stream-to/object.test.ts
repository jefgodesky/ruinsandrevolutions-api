import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import stringToReadableStream from '../string-to/readable-stream.ts'
import readableStreamToObject from './object.ts'

describe('readableStreamToObject', () => {
  const json = '{"test":"Hello, world!"}'

  it('returns an object', async () => {
    const stream = stringToReadableStream(json)
    const actual = await readableStreamToObject(stream)
    expect(typeof actual).toBe('object')
    expect((actual as { test: string }).test).toBe('Hello, world!')
  })
})
