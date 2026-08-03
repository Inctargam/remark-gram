const FORMATTER = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY
const YEAR = 365 * DAY

/**
 * Ordered coarse to fine: the first unit the age fills at least once wins.
 * `seconds` is both the length of the unit and the threshold to reach it.
 */
const UNITS = [
  { seconds: YEAR, unit: 'year' },
  { seconds: MONTH, unit: 'month' },
  { seconds: WEEK, unit: 'week' },
  { seconds: DAY, unit: 'day' },
  { seconds: HOUR, unit: 'hour' },
  { seconds: MINUTE, unit: 'minute' },
] as const satisfies readonly {
  seconds: number
  unit: Intl.RelativeTimeFormatUnit
}[]

/**
 * Age of a post as shown next to its description, e.g. `2 hours ago`.
 * `now` is a parameter so the value is testable and so a story can pin it.
 *
 * Returns an empty string for an unparseable date — same contract as `formatPostDate`.
 */
export const formatPostRelativeTime = (isoDate: string, now: Date = new Date()): string => {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const elapsedSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  // A clock skew between the server and the client must not produce "in 3 seconds".
  const age = Math.max(elapsedSeconds, 0)
  const match = UNITS.find(({ seconds }) => age >= seconds)

  if (!match) {
    return 'just now'
  }

  return FORMATTER.format(-Math.floor(age / match.seconds), match.unit)
}
