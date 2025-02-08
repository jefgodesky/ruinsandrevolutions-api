import { describe, beforeEach, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import { type Spy } from '@std/testing/mock'
import { HttpError, Status } from '@oak/oak'
import createNextSpy from '../../utils/testing/create-next-spy.ts'
import enforceJsonApiAccept from './accept.ts'
import getMessage from '../../utils/get-message.ts'

describe('enforceJsonApiAccept', () => {
  let next: Spy<unknown, [], Promise<void>>

  beforeEach(() => {
    next = createNextSpy()
  })

  it('proceeds if there is no Accept header', async () => {
    const ctx = createMockContext()
    await enforceJsonApiAccept(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('proceeds if the Accept header is */*', async () => {
    const ctx = createMockContext({
      headers: [
        ['Accept', '*/*']
      ]
    })
    await enforceJsonApiAccept(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('proceeds if the Accept header contains */*', async () => {
    const ctx = createMockContext({
      headers: [
        ['Accept', '*/*, application/json']
      ]
    })
    await enforceJsonApiAccept(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('proceeds if the Accept header is valid type', async () => {
    const ctx = createMockContext({
      headers: [
        ['Accept', 'application/vnd.api+json'],
      ]
    })
    await enforceJsonApiAccept(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('proceeds if the Accept header contains valid type', async () => {
    const ctx = createMockContext({
      headers: [
        ['Accept', 'application/json, application/vnd.api+json'],
      ]
    })
    await enforceJsonApiAccept(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('returns 406 if not given a valid Accept type', async () => {
    const ctx = createMockContext({
      headers: [
        ['Accept', 'application/json'],
      ]
    })

    try {
      await enforceJsonApiAccept(ctx, next)
      expect(0).toBe('Should throw 406 error when not give a valid Accept type')
    } catch (err) {
      expect((err as HttpError).status).toBe(Status.NotAcceptable)
      expect((err as HttpError).message).toBe(getMessage('jsonapi_enforce_accept'))
    }
  })

  it('returns 406 if given an invalid profile', async () => {
    const ctx = createMockContext({
      headers: [
        ['Accept', 'application/vnd.api+json;profile="https://example.com/resource-timestamps"'],
      ]
    })

    try {
      await enforceJsonApiAccept(ctx, next)
      expect(0).toBe('Should throw 406 error when not give a valid profile')
    } catch (err) {
      expect((err as HttpError).status).toBe(Status.NotAcceptable)
      expect((err as HttpError).message).toBe(getMessage('jsonapi_enforce_accept'))
    }
  })

  it('returns 406 if given an invalid extension', async () => {
    const ctx = createMockContext({
      headers: [
        ['Accept', 'application/vnd.api+json;ext="https://jsonapi.org/ext/version"'],
      ]
    })

    try {
      await enforceJsonApiAccept(ctx, next)
      expect(0).toBe('Should throw 406 error when not give a valid extension')
    } catch (err) {
      expect((err as HttpError).status).toBe(Status.NotAcceptable)
      expect((err as HttpError).message).toBe(getMessage('jsonapi_enforce_accept'))
    }
  })

  it('returns 406 if given any other parameter', async () => {
    const ctx = createMockContext({
      headers: [
        ['Accept', 'application/vnd.api+json;other="hello"'],
      ]
    })

    try {
      await enforceJsonApiAccept(ctx, next)
      expect(0).toBe('Should throw 406 error when given an invalid parameter')
    } catch (err) {
      expect((err as HttpError).status).toBe(Status.NotAcceptable)
      expect((err as HttpError).message).toBe(getMessage('jsonapi_enforce_accept'))
    }
  })

  it('proceeds if any Accept type is valid', async () => {
    const ctx = createMockContext({
      headers: [
        ['Accept', 'application/json, application/vnd.api+json;other="hello", application/vnd.api+json'],
      ]
    })
    await enforceJsonApiAccept(ctx, next)
    expect(next.calls).toHaveLength(1)
  })
})
