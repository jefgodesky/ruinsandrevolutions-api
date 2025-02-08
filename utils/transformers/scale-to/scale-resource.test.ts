import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createFields } from '../../../types/fields.ts'
import { createScale } from '../../../types/scale.ts'
import ScaleAttributes, { type ScaleAttributesKeys, scaleAttributes, createScaleAttributes } from '../../../types/scale-attributes.ts'
import getAllFieldCombinations from '../../testing/get-all-field-combinations.ts'
import getRoot from '../../get-root.ts'
import scaleToScaleResource from './scale-resource.ts'

describe('scaleToScaleResource', () => {
  const attributes = createScaleAttributes()
  const scale = createScale({ ...attributes })
  const all = scaleAttributes.map(field => field as keyof ScaleAttributes)

  it('returns a ScaleResource object', () => {
    const actual = scaleToScaleResource(scale)
    const expected = {
      type: 'scales',
      id: scale.id,
      attributes,
      relationships: {
        authors: {
          links: {
            self: `${getRoot()}/scales/${scale.slug}/relationships/authors`,
          },
          data: [
            { type: 'users', id: scale.authors[0].id }
          ]
        }
      }
    }
    expect(actual).toEqual(expected)
  })

  it('can return a sparse fieldset', () => {
    const objects = getAllFieldCombinations(attributes)
    for (const object of objects) {
      const fields = createFields({ scales: Object.keys(object) as ScaleAttributesKeys[] })
      const excluded = all.filter(attr => !fields.scales.includes(attr))
      const actual = scaleToScaleResource(scale, fields)
      const attributes = actual.attributes!

      expect(Object.keys(attributes)).toHaveLength(fields.scales.length)
      for (const field of (fields.scales as (keyof ScaleAttributes)[])) expect(attributes[field]).toBe(scale[field])
      for (const ex of excluded) expect(attributes[ex]).not.toBeDefined()
    }
  })
})
