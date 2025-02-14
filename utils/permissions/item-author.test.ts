import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import { createScale } from '../../types/scale.ts'
import { createScroll } from '../../types/scroll.ts'
import { createTable } from '../../types/table.ts'
import { createUser } from '../../types/user.ts'
import checkItemAuthorPermission from './item-author.ts'

describe('checkItemAuthorPermission', () => {
  const user = createUser()
  const scale = createScale({ authors: [user] })
  const scroll = createScroll({ authors: [user] })
  const table = createTable({ authors: [user] })

  // deno-lint-ignore no-explicit-any
  const scenarios: Array<{ state: Record<string, any>, prefix: string }> = [
    { state: { scale }, prefix: 'scale' },
    { state: { scroll }, prefix: 'scroll' },
    { state: { table }, prefix: 'table' }
  ]

  it('returns false if the client does not have the author version', () => {
    for (const { state, prefix } of scenarios) {
      const ctx = createMockContext({
        state: { ...state, permissions: [], client: user }
      })
      expect(checkItemAuthorPermission(ctx, `${prefix}:a`)).toBe(false)
    }
  })

  it('returns false if the permission is granted but there is no client', () => {
    for (const { state, prefix } of scenarios) {
      const ctx = createMockContext({
        state: { ...state, permissions: [`${prefix}:author:a`] }
      })
      expect(checkItemAuthorPermission(ctx, `${prefix}:a`)).toBe(false)
    }
  })

  it('returns false if the permission is granted but you\'re not an author', () => {
    const client = createUser({ name: 'Jane Doe', username: 'jane' })
    for (const { state, prefix } of scenarios) {
      const ctx = createMockContext({
        state: { ...state, permissions: [`${prefix}:author:a`], client }
      })
      expect(checkItemAuthorPermission(ctx, `${prefix}:a`)).toBe(false)
    }
  })

  it('returns true if the permission is granted and you\'re an author', () => {
    for (const { state, prefix } of scenarios) {
      const ctx = createMockContext({
        state: { ...state, permissions: [`${prefix}:author:a`], client: user }
      })
      expect(checkItemAuthorPermission(ctx, `${prefix}:a`)).toBe(true)
    }
  })
})
