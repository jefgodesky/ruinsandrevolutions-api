import { describe, afterEach, afterAll, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { type Context } from '@oak/oak'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import type Scale from '../../types/scale.ts'
import DB from '../../DB.ts'
import setupScales from '../../utils/testing/setup-scales.ts'
import loadScale from './scale.ts'

describe('loadScale', () => {
  afterEach(DB.clear)
  afterAll(DB.close)

  const expectScale = (ctx: Context, scale: Scale) => {
    expect(ctx.state.scale).toBeDefined()
    expect(ctx.state.scale.id).toBe(scale.id)
    expect(ctx.state.scale.name).toBe(scale.name)
  }

  it('loads the scale requested by ID', async () => {
    const { scales } = await setupScales(1)
    const ctx = createMockContext({
      state: { params: { scaleId: scales[0].id } }
    })

    await loadScale(ctx, createMockNext())
    expectScale(ctx, scales[0])
  })

  it('loads the scale requested by slug', async () => {
    const { scales } = await setupScales(1)
    const ctx = createMockContext({
      state: { params: { scaleId: scales[0].slug } }
    })

    await loadScale(ctx, createMockNext())
    expectScale(ctx, scales[0])
  })
})
