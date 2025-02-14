import { describe, afterEach, afterAll, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { type Context } from '@oak/oak'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import type Table from '../../types/table.ts'
import DB from '../../DB.ts'
import setupTables from '../../utils/testing/setup-tables.ts'
import loadTable from './table.ts'

describe('loadTable', () => {
  afterEach(DB.clear)
  afterAll(DB.close)

  const expectTable = (ctx: Context, table: Table) => {
    expect(ctx.state.table).toBeDefined()
    expect(ctx.state.table.id).toBe(table.id)
    expect(ctx.state.table.name).toBe(table.name)
  }

  it('loads the table requested by ID', async () => {
    const { tables } = await setupTables(1)
    const ctx = createMockContext({
      state: { params: { tableId: tables[0].id } }
    })

    await loadTable(ctx, createMockNext())
    expectTable(ctx, tables[0])
  })

  it('loads the table requested by slug', async () => {
    const { tables } = await setupTables(1)
    const ctx = createMockContext({
      state: { params: { tableId: tables[0].slug } }
    })

    await loadTable(ctx, createMockNext())
    expectTable(ctx, tables[0])
  })
})
