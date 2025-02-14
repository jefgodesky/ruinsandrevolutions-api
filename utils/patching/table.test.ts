import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type TableRollMethod from '../../types/table-roll-method.ts'
import type TableRow from '../../types/table-row.ts'
import { createTable } from '../../types/table.ts'
import UserResource, { createUserResource } from '../../types/user-resource.ts'
import patchTable from './table.ts'

describe('patchTable', () => {
  const name = 'Patched Table'
  const methods: Record<string, TableRollMethod> = { normal: { name: 'Normal', text: { human: '1d6' }, expr: '1d6' } }
  const rows: TableRow[] = [{ min: 1, max: 6, result: { name: 'Result', text: { human: 'You rolled a die.'} } }]
  const orig = createTable()
  orig.created = new Date('2025-01-01')
  orig.updated = new Date('2025-01-01')

  it('patches a table', () => {
    const patched = patchTable(orig, {
      data: {
        type: 'tables',
        id: orig.id ?? 'ERROR',
        attributes: { name, methods, rows }
      }
    })

    expect(patched.id).toBe(orig.id)
    expect(patched.name).toBe(name)
    expect(patched.methods).toEqual(methods)
    expect(patched.rows).toEqual(rows)
    expect(patched.description).toBe(orig.description)
    expect(patched.authors).toEqual(orig.authors)
    expect(patched.created).toEqual(orig.created)
    expect((patched.updated as Date).getTime()).toBeGreaterThan((orig.updated as Date).getTime())
  })

  it('adds authors', () => {
    const patched = patchTable(orig, {
      data: {
        type: 'tables',
        id: orig.id ?? 'ERROR',
        attributes: {},
        relationships: {
          authors: {
            data: [
              ...orig.authors.map(author => ({ type: 'users', id: author.id ?? 'ERROR' } as UserResource)),
              createUserResource()
            ]
          }
        }
      }
    })

    expect(patched.authors).toHaveLength(2)
  })

  it('removes authors', () => {
    const patched = patchTable(orig, {
      data: {
        type: 'tables',
        id: orig.id ?? 'ERROR',
        attributes: {},
        relationships: { authors: { data: [] } }
      }
    })

    expect(patched.authors).toHaveLength(0)
  })
})
