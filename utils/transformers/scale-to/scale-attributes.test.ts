import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createFields } from '../../../types/fields.ts'
import { createScale } from '../../../types/scale.ts'
import ScaleAttributes, { type ScaleAttributesKeys, scaleAttributes, createScaleAttributes } from '../../../types/scale-attributes.ts'
import getAllFieldCombinations from '../../testing/get-all-field-combinations.ts'
import scaleToScaleAttributes from './scale-attributes.ts'

describe('scaleToScaleAttributes', () => {
  const attributes = createScaleAttributes()
  const scale = createScale({ ...attributes })
  const all = scaleAttributes.map(field => field as keyof ScaleAttributes)

  it('returns a ScaleAttributes partial', () => {
    const actual = scaleToScaleAttributes(scale)
    for (const field of all) {
      expect(actual[field]).toEqual(scale[field])
    }
  })

  it('can return a sparse fieldset', () => {
    const objects = getAllFieldCombinations(attributes)
    for (const object of objects) {
      const fields = createFields({ scales: Object.keys(object) as ScaleAttributesKeys[] })
      const excluded = all.filter(attr => !fields.scales.includes(attr))
      const actual = scaleToScaleAttributes(scale, fields)

      expect(Object.keys(actual)).toHaveLength(fields.scales.length)
      for (const field of fields.scales.map(f => f as keyof ScaleAttributes)) expect(actual[field]).toEqual(scale[field])
      for (const ex of excluded) expect(actual[ex]).not.toBeDefined()
    }
  })
})
