import type RandomizedString from '../../types/randomized-string.ts'
import type Note from '../../types/note.ts'
import type Scroll from '../../types/scroll.ts'
import type ScrollAttributes from '../../types/scroll-attributes.ts'
import type ScrollPatch from '../../types/scroll-patch.ts'
import UserResource from '../../types/user-resource.ts'

const patchScroll = (scroll: Scroll, patch: ScrollPatch): Scroll => {
  const patched = structuredClone(scroll)

  const patchedKeys = Object.keys(patch.data.attributes) as (keyof ScrollAttributes)[]
  for (const key of patchedKeys) {
    patched[key] = patch.data.attributes[key] as string & string[] & RandomizedString & Note[] & Date
  }

  if (patch.data.relationships?.authors?.data) {
    const resources = structuredClone(patch.data.relationships.authors.data) as UserResource[]
    patched.authors = resources.map(res => ({ id: res.id, name: '' }))
  }

  patched.updated = new Date()
  return patched
}

export default patchScroll
