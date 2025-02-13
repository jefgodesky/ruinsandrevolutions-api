import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import { createScaleCreation } from '../../types/scale-creation.ts'
import { createScrollCreation } from '../../types/scroll-creation.ts'
import { createTableCreation } from '../../types/table-creation.ts'
import stringToReadableStream from '../../utils/transformers/string-to/readable-stream.ts'
import loadItemCreation from './item-creation.ts'

describe('loadItemCreation', () => {
  it('loads item creation body into state', async () => {
    const posts = [
      createScaleCreation(),
      createScrollCreation(),
      createTableCreation()
    ]

    for (const post of posts) {
      const ctx = createMockContext({
        body: stringToReadableStream(JSON.stringify(post))
      })
      await loadItemCreation(ctx, createMockNext())
      expect(ctx.state.itemCreation).toBeDefined()
    }
  })
})
