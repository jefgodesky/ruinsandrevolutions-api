const intervalToMs = (s: string): number => {
  const seconds = s.match(/(\d+(\.\d+)?) seconds?/)
  const minutes = s.match(/(\d+(\.\d+)?) minutes?/)
  const hours = s.match(/(\d+(\.\d+)?) hours?/)
  const days = s.match(/(\d+(\.\d+)?) days?/)
  const weeks = s.match(/(\d+(\.\d+)?) weeks?/)

  const perSecond = 1000
  const perMinute = 60 * perSecond
  const perHour = 60 * perMinute
  const perDay = 24 * perHour
  const perWeek = 7 * perDay

  if (seconds) {
    const n = parseFloat(seconds[1])
    return n * perSecond
  } else if (minutes) {
    const n = parseFloat(minutes[1])
    return n * perMinute
  } else if (hours) {
    const n = parseFloat(hours[1])
    return n * perHour
  } else if (days) {
    const n = parseFloat(days[1])
    return n * perDay
  } else if (weeks) {
    const n = parseFloat(weeks[1])
    return n * perWeek
  } else {
    return 0
  }
}

export default intervalToMs
