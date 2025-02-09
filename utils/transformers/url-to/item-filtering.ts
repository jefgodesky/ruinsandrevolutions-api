import { type Context } from '@oak/oak'
import stringToDates from '../string-to/dates.ts'

const itemFilterStringFields = ['name', 'description', 'notes']
const itemFilterAuthorFields = ['author.name', 'author.username']
const itemFilterDateFields = ['created', 'updated']

const urlToItemFiltering = (input: Context | URL): { query: string, params: string[] } => {
  const url = (input as Context)?.request?.url ?? input
  const query: string[] = []
  const params: string[] = []

  const addClause = (q: string, p: string): void => {
    const num = params.length + 1
    query.push(q.replace('$1', `$${num}`))
    params.push(p)
  }

  for (const param of url.searchParams.keys()) {
    const pattern = param.match(/filter\[(.*?)](\[.*?])?/)
    if (!pattern) continue

    const fields = pattern[1].split(',').map(field => field.trim())
    const type = pattern[2] ?? '[exact]'
    const value = url.searchParams.get(param) ?? ''

    for (const field of fields) {
      const isStringField = itemFilterStringFields.includes(field)
      const isAuthorField = itemFilterAuthorFields.includes(field)
      const isDateField = itemFilterDateFields.includes(field)

      if (isStringField || isAuthorField) {
        const target = isAuthorField
          ? `u.${field.substring('author.'.length)}`
          : `i.${field}`

        if (type === '[exact]') addClause(`${target} = $1`, value)
        if (type === '[startsWith]') addClause(`${target} LIKE $1`, `${value}%`)
        if (type === '[endsWith]') addClause(`${target} LIKE $1`, `%${value}`)
        if (type === '[contains]') addClause(`${target} ILIKE $1`, `%${value}%`)
      } else if (isDateField) {
        const dates = stringToDates(value)
        if (dates === undefined) continue

        if (dates instanceof Date) addClause(`i.${field} = $1`, dates.toISOString())
        if (Array.isArray(dates)) {
          addClause(`i.${field} >= $1`, dates[0].toISOString())
          addClause(`i.${field} <= $1`, dates[1].toISOString())
        }
      }
    }
  }

  return { query: query.join(' AND '), params }
}

export default urlToItemFiltering

export {
  itemFilterStringFields,
  itemFilterAuthorFields,
  itemFilterDateFields
}
