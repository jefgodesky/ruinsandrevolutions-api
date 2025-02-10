import ItemAttributes, { createItemAttributes, isItemAttributesPartial, itemAttributes } from './item-attributes.ts'
import RandomizedString, { isRandomizedString } from './randomized-string.ts'
import Note, { isNotesArray } from './note.ts'
import hasAllProperties from '../utils/has-all-properties.ts'

export default interface ScrollAttributes extends ItemAttributes {
  start: RandomizedString
  notes?: Note[]
}

const scrollAttributes = [...itemAttributes, 'start', 'notes'] as const
type ScrollAttributesKeys = (typeof scrollAttributes)[number]

const createScrollAttributes = (overrides?: Partial<ScrollAttributes>): ScrollAttributes => {
  const item = createItemAttributes(overrides)
  return {
    ...item,
    start: { human: '4' }
  }
}

const isScrollAttributesPartial = (candidate: unknown): candidate is Partial<ScrollAttributes> => {
  if (!isItemAttributesPartial(candidate, ['start', 'notes'])) return false
  const { start, notes } = (candidate as Partial<ScrollAttributes>)
  if (start !== undefined && !isRandomizedString(start)) return false
  return notes === undefined || isNotesArray(notes)
}

const isScrollAttributes = (candidate: unknown): candidate is ScrollAttributes => {
  if (!isScrollAttributesPartial(candidate)) return false
  return hasAllProperties(candidate, ['name', 'start'])
}

export {
  createScrollAttributes,
  isScrollAttributes,
  isScrollAttributesPartial,
  scrollAttributes,
  type ScrollAttributesKeys
}
