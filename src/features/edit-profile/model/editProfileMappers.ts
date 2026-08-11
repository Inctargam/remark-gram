import type { Profile } from '@/entities/profile'

import type { EditProfileFormValues } from './editProfileFormValues'
import type { UpdateProfilePayload } from './editProfileTypes'

const PROFILE_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

export const parseProfileDate = (value: string | null): Date | null => {
  if (!value) {
    return null
  }

  // Date-only strings are parsed locally because native ISO parsing uses UTC and can shift
  // the calendar day when the value is read in another time zone.
  const match = PROFILE_DATE_PATTERN.exec(value)

  if (!match) {
    return null
  }

  const [, yearValue, monthValue, dayValue] = match
  const year = Number(yearValue)
  const month = Number(monthValue)
  const day = Number(dayValue)
  const date = new Date(year, month - 1, day)
  const isValidDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day

  return isValidDate ? date : null
}

export const formatProfileDate = (value: Date | null): string | null => {
  if (!value) {
    return null
  }

  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const mapProfileToFormValues = (profile: Profile): EditProfileFormValues => ({
  username: profile.userName,
  firstName: profile.firstName,
  lastName: profile.lastName,
  dateOfBirth: parseProfileDate(profile.dateOfBirth),
  country: profile.country,
  region: profile.region,
  city: profile.city,
  aboutMe: profile.aboutMe,
})

export const mapFormValuesToPayload = (values: EditProfileFormValues): UpdateProfilePayload => ({
  userName: values.username,
  firstName: values.firstName,
  lastName: values.lastName,
  dateOfBirth: formatProfileDate(values.dateOfBirth),
  country: values.country,
  region: values.region,
  city: values.city,
  aboutMe: values.aboutMe,
})
