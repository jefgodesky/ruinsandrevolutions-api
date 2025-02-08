import ItemAttributes, { createItemAttributes, isItemAttributesPartial, itemAttributes } from './item-attributes.ts'
import isStringArray from '../utils/guards/string-array.ts'
import hasAllProperties from '../utils/has-all-properties.ts'

export default interface ScaleAttributes extends ItemAttributes {
  levels: string[]
}

const scaleAttributes = [...itemAttributes, 'levels'] as const
type ScaleAttributesKeys = (typeof scaleAttributes)[number]

const createScaleAttributes = (overrides?: Partial<ScaleAttributes>): ScaleAttributes => {
  const item = createItemAttributes(overrides)
  return {
    ...item,
    levels: overrides?.levels ?? ['Unit tests', 'Integration tests', 'End to end tests']
  }
}

const isScaleAttributesPartial = (candidate: unknown): candidate is Partial<ScaleAttributes> => {
  if (!isItemAttributesPartial(candidate, ['levels'])) return false
  const { levels } = (candidate as Partial<ScaleAttributes>)
  return levels === undefined || isStringArray(levels)
}

const isScaleAttributes = (candidate: unknown): candidate is ScaleAttributes => {
  if (!isScaleAttributesPartial(candidate)) return false
  return hasAllProperties(candidate, ['name', 'levels'])
}

export {
  createScaleAttributes,
  isScaleAttributes,
  isScaleAttributesPartial,
  scaleAttributes,
  type ScaleAttributesKeys
}
