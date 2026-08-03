import { describe, expect, it } from 'vitest'

import { formatPostRelativeTime } from './formatPostRelativeTime'

const NOW = new Date('2026-08-01T12:00:00.000Z')

const agoBy = (seconds: number) => new Date(NOW.getTime() - seconds * 1000).toISOString()

describe('formatPostRelativeTime', () => {
  it('formats an age in hours', () => {
    expect(formatPostRelativeTime(agoBy(2 * 60 * 60), NOW)).toBe('2 hours ago')
  })

  it('formats an age in minutes', () => {
    expect(formatPostRelativeTime(agoBy(5 * 60), NOW)).toBe('5 minutes ago')
  })

  it('falls back to "just now" under a minute', () => {
    expect(formatPostRelativeTime(agoBy(30), NOW)).toBe('just now')
  })

  it('picks the coarsest matching unit', () => {
    expect(formatPostRelativeTime(agoBy(8 * 24 * 60 * 60), NOW)).toBe('last week')
    expect(formatPostRelativeTime(agoBy(400 * 24 * 60 * 60), NOW)).toBe('last year')
  })

  it('clamps a future date instead of showing a countdown', () => {
    expect(formatPostRelativeTime(agoBy(-120), NOW)).toBe('just now')
  })

  it('returns an empty string for an unparseable date', () => {
    expect(formatPostRelativeTime('not-a-date', NOW)).toBe('')
  })
})
