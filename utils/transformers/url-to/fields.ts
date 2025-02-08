import { Context } from '@oak/oak'
import { intersect } from '@std/collections'
import Fields, { createFields } from '../../../types/fields.ts'

const urlToFields = (input: Context | URL): Fields => {
  const url = (input as Context)?.request?.url ?? input
  const fields = createFields()

  const updateField = <K extends keyof Fields>(key: K) => {
    const param = url.searchParams.get(`fields[${key}]`)
    if (param !== null) {
      const requested = param.split(',').map(field => field.trim()) as Fields[K]
      fields[key] = intersect(requested, fields[key]) as Fields[K]
    }
  }

  (Object.keys(fields) as (keyof Fields)[]).forEach(updateField)
  return fields
}

export default urlToFields
