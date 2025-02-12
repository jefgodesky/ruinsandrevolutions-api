import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createTable } from '../../../types/table.ts'
import getRoot from '../../get-root.ts'
import tableToLink from './link.ts'

describe('tableToLink', () => {
  it('uses the slug if it has one', () => {
    const table = createTable()
    expect(tableToLink(table)).toBe(`${getRoot()}/tables/${table.slug}`)
  })

  it('uses the ID if it has no slug', () => {
    const table = createTable({ slug: undefined })
    expect(tableToLink(table)).toBe(`${getRoot()}/tables/${table.id}`)
  })
})
