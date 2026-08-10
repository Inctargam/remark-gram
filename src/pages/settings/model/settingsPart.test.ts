import { describe, expect, it } from 'vitest'

import { isSettingsPart, SETTINGS_PARTS } from './settingsPart'

describe('isSettingsPart', () => {
  it.each(Object.values(SETTINGS_PARTS))('accepts "%s"', (part) => {
    expect(isSettingsPart(part)).toBe(true)
  })

  it.each([
    ['a missing value', undefined],
    ['an unknown value', 'security'],
    ['repeated values', ['devices', 'payments']],
  ])('rejects %s', (_, part) => {
    expect(isSettingsPart(part)).toBe(false)
  })
})
