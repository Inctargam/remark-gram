const FORMATTER = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/**
 * Publication date as shown in the post view, e.g. `July 3, 2026`.
 * Fixed to UTC on purpose: the same post must not read as a different day
 * on the server render and on the client one.
 *
 * Returns an empty string for anything unparseable, so a broken date from the API
 * hides the line instead of printing `Invalid Date`.
 */
export const formatPostDate = (isoDate: string): string => {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return FORMATTER.format(date)
}
