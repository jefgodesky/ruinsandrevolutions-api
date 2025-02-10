import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createScale } from '../../types/scale.ts'
import UserResource, { createUserResource } from '../../types/user-resource.ts'
import patchScale from './scale.ts'

describe('patchScale', () => {
  const name = 'Patched Scale'
  const levels = ['X', 'Y', 'Z']
  const orig = createScale()
  orig.created = new Date('2025-01-01')
  orig.updated = new Date('2025-01-01')

  it('patches a scale', () => {
    const patched = patchScale(orig, {
      data: {
        type: 'scales',
        id: orig.id ?? 'ERROR',
        attributes: { name, levels }
      }
    })

    expect(patched.id).toBe(orig.id)
    expect(patched.name).toBe(name)
    expect(patched.levels).toEqual(levels)
    expect(patched.description).toBe(orig.description)
    expect(patched.authors).toEqual(orig.authors)
    expect(patched.created).toEqual(orig.created)
    expect((patched.updated as Date).getTime()).toBeGreaterThan((orig.updated as Date).getTime())
  })

  it('adds authors', () => {
    const patched = patchScale(orig, {
      data: {
        type: 'scales',
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
    const patched = patchScale(orig, {
      data: {
        type: 'scales',
        id: orig.id ?? 'ERROR',
        attributes: {},
        relationships: { authors: { data: [] } }
      }
    })

    expect(patched.authors).toHaveLength(0)
  })
})
