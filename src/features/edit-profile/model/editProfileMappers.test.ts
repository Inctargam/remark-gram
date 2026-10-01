import { describe, expect, it } from 'vitest'

import type { Profile } from '@/entities/profile'

import {
  formatProfileDate,
  mapFormValuesToBackendPayload,
  mapProfileToFormValues,
  parseProfileDate,
} from './editProfileMappers'

const PROFILE: Profile = {
  id: 1,
  userName: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  city: 'Austin',
  country: 'United States',
  countryCode: 'US',
  avatarFileId: null,
  dateOfBirth: '1990-01-02',
  aboutMe: 'About me',
  avatars: [],
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
    expect(formValues.country).toBe('US')
    expect(mapFormValuesToBackendPayload(formValues)).toEqual({
      username: 'user123',
      firstName: 'John',
      lastName: 'Doe',
      city: 'Austin',
      countryCode: 'US',
      dateOfBirth: '1990-01-02',
      aboutMe: 'About me',
    })
  })

  it('maps a null API date to the form and back', () => {
    const formValues = mapProfileToFormValues({ ...PROFILE, dateOfBirth: null })

    expect(formValues.dateOfBirth).toBeNull()
    expect(mapFormValuesToBackendPayload(formValues).dateOfBirth).toBe('')
  })

  it('sends backend field names and empty strings for cleared optional values', () => {
    const formValues = mapProfileToFormValues({ ...PROFILE, dateOfBirth: null })

    expect(
      mapFormValuesToBackendPayload({
        ...formValues,
        country: '',
        city: '',
        aboutMe: '',
      })
    ).toEqual({
      username: 'user123',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '',
      aboutMe: '',
      countryCode: '',
      city: '',
    })
  })

  it('falls back to a null form date when the API date is invalid', () => {
    expect(mapProfileToFormValues({ ...PROFILE, dateOfBirth: '2025-02-29' }).dateOfBirth).toBeNull()
  })
})
