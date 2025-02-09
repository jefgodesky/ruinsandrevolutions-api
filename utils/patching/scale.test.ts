import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createScale } from '../../types/scale.ts'
import type ScalePatch from '../../types/scale-patch.ts'
import patchScale from './scale.ts'

describe('patchScale', () => {
  const name = 'Patched Scale'
  const levels = ['X', 'Y', 'Z']
  const orig = createScale()
  orig.created = new Date('2025-01-01')
  orig.updated = new Date('2025-01-01')

  const patch: ScalePatch = {
    data: {
      type: 'scales',
      id: orig.id ?? 'ERROR',
      attributes: { name, levels }
    }
  }

  it('patches a scale', () => {
    const patched = patchScale(orig, patch)
    expect(patched.id).toBe(orig.id)
    expect(patched.name).toBe(name)
    expect(patched.levels).toEqual(levels)
    expect(patched.description).toBe(orig.description)
    expect(patched.created).toEqual(orig.created)
    expect((patched.updated as Date).getTime()).toBeGreaterThan((orig.updated as Date).getTime())
  })
})
