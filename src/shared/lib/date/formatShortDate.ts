const FORMATTER = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})

/**
 * Date as shown in subscription and payment tables, e.g. `12.02.2022`.
 * Fixed to UTC so a server render and a client render never disagree about the day.
 *
 * Returns an empty string for anything unparseable: a broken date from the API
 * leaves the cell empty instead of printing `Invalid Date`.
 */
export const formatShortDate = (isoDate: string): string => {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  // en-GB gives `12/02/2022`; the design uses dots.
  return FORMATTER.format(date).replace(/\//g, '.')
}
