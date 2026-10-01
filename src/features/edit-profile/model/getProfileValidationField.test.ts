import { describe, expect, it } from 'vitest'

import { getProfileValidationField } from './getProfileValidationField'

describe('profile validation field', () => {
  it.each([
    ['username must match the required pattern', 'username'],
    ['dateOfBirth must be a valid date', 'dateOfBirth'],
    ['countryCode must be a country code', 'country'],
    ['city should not be empty', 'city'],
  ] as const)('maps %s to %s', (message, field) => {
    expect(getProfileValidationField(message)).toBe(field)
  })

  it('leaves service errors without a field in the general alert', () => {
    expect(getProfileValidationField('Personal information was rejected')).toBeNull()
  })
})
