import { describe, expect, it } from 'vitest'

import {
  formatProfileDate,
  mapFormValuesToPayload,
  mapProfileToFormValues,
  parseProfileDate,
} from './editProfileMappers'
import type { ProfileDto } from './editProfileTypes'

const PROFILE: ProfileDto = {
  id: 1,
  userName: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  city: 'Austin',
  country: 'United States',
  region: 'Texas',
  dateOfBirth: '1990-01-02',
  aboutMe: 'About me',
  avatars: [],
  createdAt: '2026-08-06T14:41:15.904Z',
}

describe('edit profile mappers', () => {
  it('parses and formats an API date without a timezone shift', () => {
    const date = parseProfileDate('1990-01-02')

    expect(date).toEqual(new Date(1990, 0, 2))
    expect(formatProfileDate(date)).toBe('1990-01-02')
  })

  it.each(['1990-02-31', '2025-02-29', '1990-00-01', '1990-13-01', '02.01.1990'])(
    'rejects the malformed API date %j',
    (value) => {
      expect(parseProfileDate(value)).toBeNull()
    }
  )

  it('accepts a leap day in a leap year', () => {
    expect(parseProfileDate('2024-02-29')).toEqual(new Date(2024, 1, 29))
  })

  it('preserves an empty date in both directions', () => {
    expect(parseProfileDate(null)).toBeNull()
    expect(formatProfileDate(null)).toBeNull()
  })

  it('maps the backend field names to RHF and back', () => {
    const formValues = mapProfileToFormValues(PROFILE)

    expect(formValues.username).toBe('user123')
    expect(formValues.dateOfBirth).toEqual(new Date(1990, 0, 2))
    expect(mapFormValuesToPayload(formValues)).toEqual({
      userName: 'user123',
      firstName: 'John',
      lastName: 'Doe',
      city: 'Austin',
      country: 'United States',
      region: 'Texas',
      dateOfBirth: '1990-01-02',
      aboutMe: 'About me',
    })
  })

  it('maps a null API date to the form and back', () => {
    const formValues = mapProfileToFormValues({ ...PROFILE, dateOfBirth: null })

    expect(formValues.dateOfBirth).toBeNull()
    expect(mapFormValuesToPayload(formValues).dateOfBirth).toBeNull()
  })

  it('falls back to a null form date when the API date is invalid', () => {
    expect(mapProfileToFormValues({ ...PROFILE, dateOfBirth: '2025-02-29' }).dateOfBirth).toBeNull()
  })
})
