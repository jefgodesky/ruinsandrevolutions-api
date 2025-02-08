import getEnvNumber from './get-env-number.ts'


const getPaginationQueries = (
  total: number,
  offset: number,
  limit: number = getEnvNumber('DEFAULT_PAGE_SIZE', 10)
): {
  first: string,
  prev: string,
  next: string,
  last: string
} => {
  const lastIndex = total - 1
  const first = 0
  const last = lastIndex - (lastIndex % limit)
  const prev = Math.max(first, offset - (offset % limit) - limit)
  const next = Math.min(last, offset - (offset % limit) + limit)

  return {
    first: `offset=${first}&limit=${limit}`,
    prev: `offset=${prev}&limit=${limit}`,
    next: `offset=${next}&limit=${limit}`,
    last: `offset=${last}&limit=${limit}`
  }
}

export default getPaginationQueries
