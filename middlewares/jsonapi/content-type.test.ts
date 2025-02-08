import { describe, beforeEach, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { type Spy } from '@std/testing/mock'
import { createMockContext } from '@oak/oak/testing'
import { HttpError, Status } from '@oak/oak'
import createNextSpy from '../../utils/testing/create-next-spy.ts'
import getMessage from '../../utils/get-message.ts'
import enforceJsonApiContentType from './content-type.ts'

describe('enforceJsonApiContentType', () => {
  let next: Spy<unknown, [], Promise<void>>

  beforeEach(() => {
    next = createNextSpy()
  })

  it('proceeds if there is no Content-Type header', async () => {
    const ctx = createMockContext()
    await enforceJsonApiContentType(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('proceeds if given a valid Content-Type header', async () => {
    const ctx = createMockContext({
      headers: [
        ['Content-Type', 'application/vnd.api+json'],
      ]
    })
    await enforceJsonApiContentType(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('returns 415 if not given a valid Content-Type header', async () => {
    const ctx = createMockContext({
      headers: [
        ['Content-Type', 'application/json'],
      ]
    })

    try {
      await enforceJsonApiContentType(ctx, next)
      expect(0).toBe('Should throw 415 error when given an invalid Content-Type header')
    } catch (err) {
      expect((err as HttpError).status).toBe(Status.UnsupportedMediaType)
      expect((err as HttpError).message).toBe(getMessage('jsonapi_enforce_content_type'))
      expect(next.calls).toHaveLength(0)
    }
  })

  it('returns 415 if given an invalid profile', async () => {
    const ctx = createMockContext({
      headers: [
        ['Content-Type', 'application/vnd.api+json;profile="https://example.com/resource-timestamps"'],
      ]
    })

    try {
      await enforceJsonApiContentType(ctx, next)
      expect(0).toBe('Should throw 415 error when given an invalid profile')
    } catch (err) {
      expect((err as HttpError).status).toBe(Status.UnsupportedMediaType)
      expect((err as HttpError).message).toBe(getMessage('jsonapi_enforce_content_type'))
      expect(next.calls).toHaveLength(0)
    }
  })

  it('returns 415 if given an invalid extension', async () => {
    const ctx = createMockContext({
      headers: [
        ['Content-Type', 'application/vnd.api+json;ext="https://jsonapi.org/ext/version"'],
      ]
    })

    try {
      await enforceJsonApiContentType(ctx, next)
      expect(0).toBe('Should throw 415 error when given an invalid extension')
    } catch (err) {
      expect((err as HttpError).status).toBe(Status.UnsupportedMediaType)
      expect((err as HttpError).message).toBe(getMessage('jsonapi_enforce_content_type'))
      expect(next.calls).toHaveLength(0)
    }
  })

  it('returns 415 if given any other parameter', async () => {
    const ctx = createMockContext({
      headers: [
        ['Content-Type', 'application/vnd.api+json;other="hello"'],
      ]
    })

    try {
      await enforceJsonApiContentType(ctx, next)
      expect(0).toBe('Should throw 415 error when given an invalid Content-Type parameter')
    } catch (err) {
      expect((err as HttpError).status).toBe(Status.UnsupportedMediaType)
      expect((err as HttpError).message).toBe(getMessage('jsonapi_enforce_content_type'))
      expect(next.calls).toHaveLength(0)
    }
  })
})
