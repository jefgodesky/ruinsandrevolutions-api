import Note, { createNote, isNote } from './note.ts'
import isObject from '../utils/guards/object.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface TableRollMethod extends Note {
  expr: string
}

const createTableRollMethod = (overrides?: Partial<TableRollMethod>): TableRollMethod => {
  return {
    ...createNote(overrides),
    expr: overrides?.expr ?? '2d6 + Ability'
  }
}

const isTableRollMethod = (candidate: unknown): candidate is TableRollMethod => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>
  const { expr, ...notes } = obj
  if (!isNote(notes)) return false
  if (typeof expr !== 'string') return false
  return hasNoOtherProperties(obj, ['expr', 'name', 'text'])
}

const isTableRollMethodDict = (candidate: unknown): candidate is Record<string, TableRollMethod> => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>
  return Object.keys(obj).every(key => isTableRollMethod(obj[key]))
}

export {
  createTableRollMethod,
  isTableRollMethod,
  isTableRollMethodDict
}
