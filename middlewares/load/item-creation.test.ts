import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import { createScaleCreation } from '../../types/scale-creation.ts'
import stringToReadableStream from '../../utils/transformers/string-to/readable-stream.ts'
import loadItemCreation from './item-creation.ts'

describe('loadItemCreation', () => {
  it('loads ScaleCreation body into state', async () => {
    const ctx = createMockContext({
      body: stringToReadableStream(JSON.stringify(createScaleCreation()))
    })
    await loadItemCreation(ctx, createMockNext())
    expect(ctx.state.itemCreation).toBeDefined()
  })
})
