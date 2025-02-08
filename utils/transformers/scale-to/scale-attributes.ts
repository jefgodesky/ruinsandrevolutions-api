import { intersect } from '@std/collections'
import type Fields from '../../../types/fields.ts'
import type Scale from '../../../types/scale.ts'
import ScaleAttributes, { scaleAttributes } from '../../../types/scale-attributes.ts'

const scaleToScaleAttributes = (scale: Scale, fields?: Fields): Partial<ScaleAttributes> => {
  const requested = intersect(fields?.scales ?? scaleAttributes, scaleAttributes) as (keyof ScaleAttributes)[]
  const attributes: Partial<ScaleAttributes> = {}
  for (const field of requested) {
    const value = scale[field] as (string & string[] & Date) | undefined
    if (value) attributes[field] = value
  }
  return attributes
}

export default scaleToScaleAttributes
