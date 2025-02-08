import isObject from '../utils/guards/object.ts'
import isStringOrUndefined from '../utils/guards/string.ts'
import isDateOrUndefined from '../utils/guards/date.ts'
import hasNoOtherProperties from '../utils/has-no-other-properties.ts'

export default interface ItemAttributes {
  name: string
  slug?: string
  description?: string
  body?: string
  attribution?: string
  created?: Date
  updated?: Date
}

const requiredStrings = ['name']
const optionalStrings = ['slug', 'description', 'body', 'attribution']
const optionalDates = ['created', 'updated']
const itemAttributes = [...requiredStrings, ...optionalStrings, ...optionalDates] as const
type ItemAttributesKeys = (typeof itemAttributes)[number]

const createItemAttributes = (overrides?: Partial<ItemAttributes>): ItemAttributes => {
  const defaultAttributes: ItemAttributes = {
    name: 'Test Item',
    slug: 'test',
    description: 'This is a test item.',
    body: 'Items can have a longer body property.',
    attribution: 'This is based on...',
    created: new Date,
    updated: new Date
  }

  return { ...defaultAttributes, ...overrides }
}

const isItemAttributesPartial = (candidate: unknown, additionalFields: string[] = []): candidate is Partial<ItemAttributes> => {
  if (!isObject(candidate)) return false
  const obj = candidate as Record<string, unknown>
  if (![...requiredStrings, ...optionalStrings].every(s => isStringOrUndefined(obj[s]))) return false
  if (!optionalDates.every(d => isDateOrUndefined(obj[d]))) return false
  return hasNoOtherProperties(obj, [...itemAttributes.map(key => key.toString()), ...additionalFields])
}

const isItemAttributes = (candidate: unknown, additionalFields: string[] = []): candidate is ItemAttributes => {
  if (!isItemAttributesPartial(candidate, additionalFields)) return false
  return requiredStrings.every(s => typeof candidate[s as keyof ItemAttributes] === 'string')
}

export {
  createItemAttributes,
  isItemAttributes,
  isItemAttributesPartial,
  itemAttributes,
  type ItemAttributesKeys
}
