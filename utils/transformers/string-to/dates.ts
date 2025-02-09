import { toSeconds, parse } from '@tolu/iso8601-duration'
import isDateOrUndefined from '../../guards/date.ts'

const isISO8601Duration = (expr: string): boolean => {
  const regex = /^P((\d*[.,]?\d+Y)?(\d*[.,]?\d+M)?(\d*[.,]?\d+D)?)?(\d*[.,]?\d+W)?(T(\d*[.,]?\d+H)?(\d*[.,]?\d+M)?(\d*[.,]?\d+S)?)?$/
  const match = expr.match(regex)
  if (match === null) return false

  // If you specify weeks, you should not specify anything else
  const weekIndex = 5
  const hasWeeks = match[weekIndex] !== undefined
  if (hasWeeks) {
    for (let i = 1; i < match.length; i++) {
      if (i === weekIndex) continue
      if (match[i] !== undefined) return false
    }
  }

  return true
}

const relativeStringToDates = (expr: string): [Date, Date] | undefined => {
  if (!isISO8601Duration(expr)) return undefined
  const ms = toSeconds(parse(expr)) * 1000
  const end = new Date()
  const start = new Date(end.getTime() - ms)
  return [start, end]
}

const dayStringToDates = (expr: string): [Date, Date] | undefined => {
  if (!isDateOrUndefined(new Date(expr))) return undefined
  const start = 'T00:00:00.000Z'
  const end = 'T23:59:59.999Z'
  return [
    new Date(expr + start),
    new Date(expr + end)
  ]
}

const stringToDates = (expr: string): Date | [Date, Date] | undefined => {
  const isRelative = expr.startsWith('P')
  if (isRelative) return relativeStringToDates(expr)

  const isRange = expr.includes('...')
  if (!isRange && expr.includes('T')) return new Date(expr)
  if (!isRange) return dayStringToDates(expr)

  const [start, end] = expr.split('...')
  if (!isDateOrUndefined(new Date(start))) return undefined
  if (!isDateOrUndefined(new Date(end))) return undefined
  const dates = [stringToDates(start), stringToDates(end)].flat()
  const timestamps = dates
    .map(date => date?.getTime())
    .filter(d => d !== undefined)
  return timestamps.length > 0
    ? [new Date(Math.min(...timestamps)), new Date(Math.max(...timestamps))]
    : undefined
}

export default stringToDates
export {
  isISO8601Duration,
  relativeStringToDates,
  dayStringToDates
}
