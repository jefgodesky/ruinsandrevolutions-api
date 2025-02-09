import { describe, beforeEach, afterEach, afterAll, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { type Context } from '@oak/oak'
import type User from '../../types/user.ts'
import type UserResource from '../../types/user-resource.ts'
import DB from '../../DB.ts'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import { createScaleCreation } from '../../types/scale-creation.ts'
import setupUser from '../../utils/testing/setup-user.ts'
import loadBackupAuthor from './backup-author.ts'

describe('loadItemCreation', () => {
  let client: User

  beforeEach(async () => {
    const { user } = await setupUser({ createAccount: false, createToken: false })
    client = user
  })

  afterEach(DB.clear)
  afterAll(DB.close)

  const expectAuthors = (ctx: Context, expectedAuthors: User[]) => {
    const data = ctx.state.itemCreation.data.relationships.authors.data as UserResource[]
    const ids = expectedAuthors.map(author => author.id)
    expect(data).toHaveLength(expectedAuthors.length)
    expect(data.every(a => ids.includes(a.id))).toBe(true)
  }

  it('does nothing to ScaleCreation with verified author', async () => {
    const ctx = createMockContext({
      state: { client, itemCreation: createScaleCreation(undefined, [client]) }
    })
    await loadBackupAuthor(ctx, createMockNext())
    expectAuthors(ctx, [client])
  })

  it('adds client to ScaleCreation with no authors', async () => {
    const ctx = createMockContext({
      state: { client, itemCreation: createScaleCreation(undefined, []) }
    })
    await loadBackupAuthor(ctx, createMockNext())
    expectAuthors(ctx, [client])
  })

  it('adds client to ScaleCreation with no verified authors', async () => {
    const ctx = createMockContext({
      state: { client, itemCreation: createScaleCreation(undefined, [crypto.randomUUID(), 'not even a UUID']) }
    })
    await loadBackupAuthor(ctx, createMockNext())
    expectAuthors(ctx, [client])
  })
})
