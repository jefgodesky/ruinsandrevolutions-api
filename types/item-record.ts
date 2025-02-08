import ItemAttributes, { createItemAttributes } from './item-attributes.ts'
import type JSONValue from './json.ts'
import type User from './user.ts'

const itemTypes = ['scale', 'scroll', 'table'] as const
type ItemType = (typeof itemTypes)[number]

export default interface ItemRecord extends ItemAttributes {
  id?: string
  type: ItemType
  data: JSONValue
}

type ItemRecordWithAuthors = ItemRecord & { authors: User[] }

const createItemRecord = (override?: Partial<ItemRecord>): ItemRecord => {
  const attributes = createItemAttributes(override)
  const defaultRecord: ItemRecord = {
    id: crypto.randomUUID(),
    type: 'scale',
    data: ['Unit tests','Integration tests','End-to-end tests'],
    ...attributes
  }

  return { ...defaultRecord, ...override }
}

export {
  createItemRecord,
  itemTypes,
  type ItemType,
  type ItemRecordWithAuthors
}
