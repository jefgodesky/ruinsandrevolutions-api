import { describe, afterEach, afterAll, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { type Context } from '@oak/oak'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import type Scroll from '../../types/scroll.ts'
import DB from '../../DB.ts'
import setupScrolls from '../../utils/testing/setup-scrolls.ts'
import loadScroll from './scroll.ts'

describe('loadScroll', () => {
  afterEach(DB.clear)
  afterAll(DB.close)

  const expectScroll = (ctx: Context, scroll: Scroll) => {
    expect(ctx.state.scroll).toBeDefined()
    expect(ctx.state.scroll.id).toBe(scroll.id)
    expect(ctx.state.scroll.name).toBe(scroll.name)
  }

  it('loads the scroll requested by ID', async () => {
    const { scrolls } = await setupScrolls(1)
    const ctx = createMockContext({
      state: { params: { scrollId: scrolls[0].id } }
    })

    await loadScroll(ctx, createMockNext())
    expectScroll(ctx, scrolls[0])
  })

  it('loads the scroll requested by slug', async () => {
    const { scrolls } = await setupScrolls(1)
    const ctx = createMockContext({
      state: { params: { scrollId: scrolls[0].slug } }
    })

    await loadScroll(ctx, createMockNext())
    expectScroll(ctx, scrolls[0])
  })
})
