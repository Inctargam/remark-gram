import { describe, expect, it } from 'vitest'

import { formatShortDate } from './formatShortDate'

describe('formatShortDate', () => {
  it('formats an ISO date as dd.MM.yyyy', () => {
    expect(formatShortDate('2022-02-12T00:00:00.000Z')).toBe('12.02.2022')
  })

  it('pads single-digit days and months', () => {
    expect(formatShortDate('2022-03-05T10:30:00.000Z')).toBe('05.03.2022')
  })

  it('reads the date in UTC, not in the local zone', () => {
    // 23:30 UTC is already the next day east of Greenwich — the day must not shift.
    expect(formatShortDate('2022-02-12T23:30:00.000Z')).toBe('12.02.2022')
  })

  it('returns an empty string for an unparseable value', () => {
    expect(formatShortDate('not a date')).toBe('')
  })
})
