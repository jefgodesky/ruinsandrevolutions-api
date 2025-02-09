import type Scale from '../../types/scale.ts'
import type ScaleAttributes from '../../types/scale-attributes.ts'
import type ScalePatch from '../../types/scale-patch.ts'

const patchScale = (scale: Scale, patch: ScalePatch): Scale => {
  const patched = structuredClone(scale)

  const patchedKeys = Object.keys(patch.data.attributes) as (keyof ScaleAttributes)[]
  for (const key of patchedKeys) {
    patched[key] = patch.data.attributes[key] as string & string[] & Date
  }

  patched.updated = new Date()
  return patched
}

export default patchScale
