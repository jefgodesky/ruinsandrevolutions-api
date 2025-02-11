import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createScroll } from '../../../types/scroll.ts'
import getRoot from '../../get-root.ts'
import scrollToLink from './link.ts'

describe('scrollToLink', () => {
  it('uses the slug if it has one', () => {
    const scroll = createScroll()
    expect(scrollToLink(scroll)).toBe(`${getRoot()}/scrolls/${scroll.slug}`)
  })

  it('uses the ID if it has no slug', () => {
    const scroll = createScroll({ slug: undefined })
    expect(scrollToLink(scroll)).toBe(`${getRoot()}/scrolls/${scroll.id}`)
  })
})
