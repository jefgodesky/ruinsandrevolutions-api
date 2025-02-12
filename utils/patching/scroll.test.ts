import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type RandomizedString from '../../types/randomized-string.ts'
import type Note from '../../types/note.ts'
import { createScroll } from '../../types/scroll.ts'
import UserResource, { createUserResource } from '../../types/user-resource.ts'
import patchScroll from './scroll.ts'

describe('patchScroll', () => {
  const name = 'Patched Scroll'
  const start: RandomizedString = { human: '4' }
  const notes: Note[] = [{ name: 'Upated Note', text: { human: 'Updated' } }]
  const orig = createScroll()
  orig.created = new Date('2025-01-01')
  orig.updated = new Date('2025-01-01')

  it('patches a scroll', () => {
    const patched = patchScroll(orig, {
      data: {
        type: 'scrolls',
        id: orig.id ?? 'ERROR',
        attributes: { name, start, notes }
      }
    })

    expect(patched.id).toBe(orig.id)
    expect(patched.name).toBe(name)
    expect(patched.start).toEqual(start)
    expect(patched.notes).toEqual(notes)
    expect(patched.description).toBe(orig.description)
    expect(patched.authors).toEqual(orig.authors)
    expect(patched.created).toEqual(orig.created)
    expect((patched.updated as Date).getTime()).toBeGreaterThan((orig.updated as Date).getTime())
  })

  it('adds authors', () => {
    const patched = patchScroll(orig, {
      data: {
        type: 'scrolls',
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
    const patched = patchScroll(orig, {
      data: {
        type: 'scrolls',
        id: orig.id ?? 'ERROR',
        attributes: {},
        relationships: { authors: { data: [] } }
      }
    })

    expect(patched.authors).toHaveLength(0)
  })
})
