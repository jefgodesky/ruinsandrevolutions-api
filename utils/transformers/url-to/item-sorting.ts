import { Context } from '@oak/oak'

const urlToItemSorting = (input: Context | URL): string | undefined => {
  const url = (input as Context)?.request?.url ?? input
  const params = (url.searchParams.get('sort') ?? '').split(',').map(field => field.trim())
  const allowed = ['name', 'created', 'updated']
  const order: string[] = []

  for (const param of params) {
    const isDesc = param.substring(0, 1) === '-'
    const dir = isDesc ? 'DESC' : 'ASC'
    const field = isDesc ? param.substring(1) : param
    if (!allowed.includes(field)) continue
    order.push(`i.${field} ${dir}`)
  }

  return order.length > 0 ? order.join(', ') : undefined
}

export default urlToItemSorting
