import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { isNote, isNotesArray } from './note.ts'

describe('isNote', () => {
  const name = 'Note'
  const human = '2d6 + Intelligence'
  const computable = `{{${human}}}`

  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true']
    for (const primitive of primitives) {
      expect(isNote(primitive)).toBe(false)
    }
  })

  it('returns true if given an object with a name and a human-readable string', () => {
    expect(isNote({ name, text: { human } })).toBe(true)
  })

  it('returns true if given an object with a name and human- and computer-readable strings', () => {
    expect(isNote({ name, text: { human, computable } })).toBe(true)
  })

  it('returns false if text only has a computable string', () => {
    expect(isNote({ name, text: { computable } })).toBe(false)
  })

  it('returns false if given an object with any other properties', () => {
    expect(isNote({ name, text: { human, computable }, other: true })).toBe(false)
    expect(isNote({ name, text: { human, computable, other: true } })).toBe(false)
  })
})

describe('isNotesArray', () => {
  const notes = [
    { name: 'Note 1', text: { human: 'Note 1' } },
    { name: 'Note 2', text: { human: 'Note 2' } }
  ]

  it('returns false if given a primitive', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true', {}]
    for (const primitive of primitives) {
      expect(isNotesArray(primitive)).toBe(false)
    }
  })

  it('returns true if given an empty array', () => {
    expect(isNotesArray([])).toBe(true)
  })

  it('returns false if given an array that includes something other than notes', () => {
    const primitives = [() => {}, null, undefined, true, false, 1, 'true', {}]
    for (const primitive of primitives) {
      expect(isNotesArray([primitive])).toBe(false)
    }
  })

  it('returns true if given an array of notes', () => {
    expect(isNotesArray(notes)).toBe(true)
  })
})
