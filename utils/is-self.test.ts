import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import User, { createUser } from '../types/user.ts'
import isSelf from './is-self.ts'

describe('isSelf', () => {
  const john = createUser({ name: 'John Doe', username: 'john' })
  const jane = createUser({ name: 'Jane Doe', username: 'jane' })

  it('returns false if context doesn\'t have client or user', () => {
    expect(isSelf(createMockContext())).toBe(false)
  })

  it('returns false if context doesn\'t have client', () => {
    const ctx = createMockContext({ state: { user: john } })
    expect(isSelf(ctx)).toBe(false)
  })

  it('returns false if context client has no ID', () => {
    const ctx = createMockContext({ state: { client: { name: john.name }, user: john } })
    expect(isSelf(ctx)).toBe(false)
  })

  it('returns false if context doesn\'t have user', () => {
    const ctx = createMockContext({ state: { client: john } })
    expect(isSelf(ctx)).toBe(false)
  })

  it('returns false if context user has no ID', () => {
    const ctx = createMockContext({ state: { client: john, user: { name: john.name } } })
    expect(isSelf(ctx)).toBe(false)
  })

  it('returns false if user and client are different', () => {
    const ctx = createMockContext({ state: { client: john, user: jane } })
    expect(isSelf(ctx)).toBe(false)
  })

  it('returns true if user and client are the same', () => {
    const ctx = createMockContext({ state: { client: john, user: john } })
    expect(isSelf(ctx)).toBe(true)
  })
})
