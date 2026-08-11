import type { RegisterOptions } from 'react-hook-form'

import type { EditProfileFormValues } from './editProfileFormValues'

export const MINIMUM_AGE = 13
export const MINIMUM_AGE_ERROR = 'A user under 13 cannot create a profile.'
export const REQUIRED_FIELD_ERROR = 'This field is required.'
export const USERNAME_MIN_LENGTH = 6
export const USERNAME_MAX_LENGTH = 30
export const NAME_MAX_LENGTH = 50
export const ABOUT_ME_MAX_LENGTH = 200

const USERNAME_PATTERN = /^[0-9A-Za-z_-]+$/
const NAME_PATTERN = /^[A-Za-zА-Яа-яЁё]+$/

export const isAtLeastMinimumAge = (dateOfBirth: Date, today = new Date()) => {
  const latestAllowedDate = new Date(
    today.getFullYear() - MINIMUM_AGE,
    today.getMonth(),
    today.getDate()
  )

  return dateOfBirth <= latestAllowedDate
}

export const USERNAME_RULES: RegisterOptions<EditProfileFormValues, 'username'> = {
  required: REQUIRED_FIELD_ERROR,
  validate: {
    notWhitespace: (value) => Boolean(value.trim()) || REQUIRED_FIELD_ERROR,
    minLength: (value) =>
      value.length >= USERNAME_MIN_LENGTH || `Minimum number of characters ${USERNAME_MIN_LENGTH}`,
    maxLength: (value) =>
      value.length <= USERNAME_MAX_LENGTH || `Maximum number of characters ${USERNAME_MAX_LENGTH}`,
    pattern: (value) =>
      USERNAME_PATTERN.test(value) || 'Username may only contain 0-9, A-Z, a-z, _ and -',
  },
}

const createNameRules = (fieldLabel: 'First name' | 'Last name') => ({
  required: REQUIRED_FIELD_ERROR,
  validate: {
    notWhitespace: (value: string) => Boolean(value.trim()) || REQUIRED_FIELD_ERROR,
    maxLength: (value: string) =>
      value.length <= NAME_MAX_LENGTH || `Maximum number of characters ${NAME_MAX_LENGTH}`,
    pattern: (value: string) =>
      NAME_PATTERN.test(value) || `${fieldLabel} may only contain Latin and Cyrillic letters`,
  },
})

export const FIRST_NAME_RULES: RegisterOptions<EditProfileFormValues, 'firstName'> =
  createNameRules('First name')

export const LAST_NAME_RULES: RegisterOptions<EditProfileFormValues, 'lastName'> =
  createNameRules('Last name')

export const DATE_OF_BIRTH_RULES: RegisterOptions<EditProfileFormValues, 'dateOfBirth'> = {
  validate: {
    minimumAge: (value) => !value || isAtLeastMinimumAge(value) || MINIMUM_AGE_ERROR,
  },
}

export const ABOUT_ME_RULES: RegisterOptions<EditProfileFormValues, 'aboutMe'> = {
  validate: {
    maxLength: (value) =>
      !value ||
      value.length <= ABOUT_ME_MAX_LENGTH ||
      `Maximum number of characters ${ABOUT_ME_MAX_LENGTH}`,
  },
}
