import type { RegisterOptions } from 'react-hook-form'

import { validatePasswordsMatch } from '@/entities/auth'

import type { SignUpFormValues } from './signUpFormValues'

export const USERNAME_RULES: RegisterOptions<SignUpFormValues, 'username'> = {
  validate: {
    minLength: (value) => !value || value.length >= 6 || 'Minimum number of characters 6',
    maxLength: (value) => !value || value.length <= 30 || 'Maximum number of characters 30',
    pattern: (value) =>
      !value ||
      /^[0-9A-Za-z_-]+$/.test(value) ||
      'Username may only contain 0-9, A-Z, a-z, _ and -',
  },
}

export const PASSWORD_CONFIRMATION_RULES: RegisterOptions<
  SignUpFormValues,
  'passwordConfirmation'
> = {
  validate: {
    matches: (value, formValues) => validatePasswordsMatch(formValues.password, value),
  },
}
