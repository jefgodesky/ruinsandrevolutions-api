import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createScale } from '../../../types/scale.ts'
import getRoot from '../../get-root.ts'
import scaleToLink from './link.ts'

describe('scaleToLink', () => {
  it('uses the slug if it has one', () => {
    const scale = createScale()
    expect(scaleToLink(scale)).toBe(`${getRoot()}/scales/${scale.slug}`)
  })

  it('uses the ID if it has no slug', () => {
    const scale = createScale({ slug: undefined })
    expect(scaleToLink(scale)).toBe(`${getRoot()}/scales/${scale.id}`)
  })
})
