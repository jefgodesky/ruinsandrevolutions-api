import RandomizedString, {
  createRandomizedString,
  isRandomizedString
} from './randomized-string.ts'
import isObject from '../utils/guards/object.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface Note {
  name: string
  text: RandomizedString
}

const createNote = (overrides?: Partial<Note>): Note => {
  return {
    name: overrides?.name ?? 'Note',
    text: overrides?.text ?? createRandomizedString()
  }
}

const isNote = (candidate: unknown): candidate is Note => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>

  if (typeof obj.name !== 'string') return false
  if (!isRandomizedString(obj.text)) return false
  return hasNoOtherProperties(obj, ['name', 'text'])
}

const isNotesArray = (candidate: unknown): candidate is Note[] => {
  if (!Array.isArray(candidate)) return false
  return candidate.every(item => isNote(item))
}

export {
  createNote,
  isNote,
  isNotesArray
}
