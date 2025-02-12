import Note, { isNote } from './note.ts'
import isObject from '../utils/guards/object.ts'
import isNumberOrUndefined from '../utils/guards/number.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface TableRow {
  min?: number
  max?: number
  result: Note
}

const createTableRow = (overrides?: Partial<TableRow>): TableRow => {
  return {
    min: overrides?.min ?? 1,
    max: overrides?.max ?? 6,
    result: {
      name: 'Result',
      text: {
        human: ''
      }
    }
  }
}

const isTableRow = (candidate: unknown): candidate is TableRow => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>

  if (!isNumberOrUndefined(obj.min)) return false
  if (!isNumberOrUndefined(obj.max)) return false
  if (!isNote(obj.result)) return false
  return hasNoOtherProperties(obj, ['min', 'max', 'result'])
}

const areTableRows = (candidate: unknown): candidate is TableRow[] => {
  if (!Array.isArray(candidate)) return false
  return candidate.every(elem => isTableRow(elem))
}

export {
  createTableRow,
  isTableRow,
  areTableRows
}
