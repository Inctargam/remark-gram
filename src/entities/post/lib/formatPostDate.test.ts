import { describe, expect, it } from 'vitest'

import { formatPostDate } from './formatPostDate'

describe('formatPostDate', () => {
  it('formats an ISO date as a readable publication date', () => {
    expect(formatPostDate('2026-07-03T12:00:00.000Z')).toBe('July 3, 2026')
  })

  it('uses UTC so the day does not shift with the local timezone', () => {
    expect(formatPostDate('2026-07-03T23:30:00.000Z')).toBe('July 3, 2026')
  })

  it('returns an empty string for an unparseable date', () => {
    expect(formatPostDate('not-a-date')).toBe('')
  })

  it('returns an empty string for an empty input', () => {
    expect(formatPostDate('')).toBe('')
  })
})
