import ItemAttributes, { createItemAttributes, isItemAttributesPartial, itemAttributes } from './item-attributes.ts'
import Note, { isNotesArray } from './note.ts'
import TableRow, { areTableRows } from './table-row.ts'
import hasAllProperties from '../utils/has-all-properties.ts'

export default interface TableAttributes extends ItemAttributes {
  rolls: Note[]
  rows: TableRow[]
}

const tableAttributes = [...itemAttributes, 'rolls', 'rows'] as const
type TableAttributesKeys = (typeof tableAttributes)[number]

const createTableAttributes = (overrides?: Partial<TableAttributes>): TableAttributes => {
  const item = createItemAttributes(overrides)
  return {
    ...item,
    rolls: [{ name: 'Normal', text: { human: '2d6 + Ability' } }],
    rows: [
      { max: 6, result: { name: 'Failure', text: { human: 'Due to circumstances beyond your control, your efforts are in vain. You lose an opportunity, face a difficult choice with no good options, suffer harm, or otherwise see the situation deteriorate.' } } },
      { min: 7, max: 9, result: { name: 'Success', text: { human: 'You achieve your goal as well as you could have reasonably expected.'} } },
      { min: 10, result: { name: 'Critical Success', text: { human: 'Fortune smiles on you. Your efforts are even more effective than you could have expected.' } }}
    ]
  }
}

const isTableAttributesPartial = (candidate: unknown): candidate is Partial<TableAttributes> => {
  if (!isItemAttributesPartial(candidate, ['rolls', 'rows'])) return false
  const { rolls, rows } = (candidate as Partial<TableAttributes>)
  if (rolls !== undefined && !isNotesArray(rolls)) return false
  return rows === undefined || areTableRows(rows)
}

const isTableAttributes = (candidate: unknown): candidate is TableAttributes => {
  if (!isTableAttributesPartial(candidate)) return false
  return hasAllProperties(candidate, ['name', 'rolls', 'rows'])
}

export {
  createTableAttributes,
  isTableAttributes,
  isTableAttributesPartial,
  tableAttributes,
  type TableAttributesKeys
}
