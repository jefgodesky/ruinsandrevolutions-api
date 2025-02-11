import { intersect } from '@std/collections'
import type Fields from '../../../types/fields.ts'
import type Note from '../../../types/note.ts'
import type RandomizedString from '../../../types/randomized-string.ts'
import type Scroll from '../../../types/scroll.ts'
import ScrollAttributes, { scrollAttributes } from '../../../types/scroll-attributes.ts'

const scrollToScrollAttributes = (scroll: Scroll, fields?: Fields): Partial<ScrollAttributes> => {
  const requested = intersect(fields?.scrolls ?? scrollAttributes, scrollAttributes) as (keyof ScrollAttributes)[]
  const attributes: Partial<ScrollAttributes> = {}
  for (const field of requested) {
    const value = scroll[field] as (string & RandomizedString & Note[] & Date) | undefined
    if (value) attributes[field] = value
  }
  return attributes
}

export default scrollToScrollAttributes
