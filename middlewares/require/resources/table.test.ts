import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { HttpError, Status } from '@oak/oak'
import { createMockContext } from '@oak/oak/testing'
import { createTable } from '../../../types/table.ts'
import createNextSpy from '../../../utils/testing/create-next-spy.ts'
import getMessage from '../../../utils/get-message.ts'
import requireTable from './table.ts'

describe('requireTable', () => {
  it('proceeds if there is a table resource in state', async () => {
    const ctx = createMockContext({
      state: { table: createTable() }
    })

    const next = createNextSpy()
    await requireTable(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('returns 404 if there is no table', async () => {
    const ctx = createMockContext()
    const next = createNextSpy()

    try {
      await requireTable(ctx, next)
      expect(0).toBe('No table found should throw a 404 error.')
    } catch (err) {
      expect((err as HttpError).message).toBe(getMessage('table_not_found'))
      expect((err as HttpError).status).toBe(Status.NotFound)
      expect(next.calls).toHaveLength(0)
    }
  })
})
