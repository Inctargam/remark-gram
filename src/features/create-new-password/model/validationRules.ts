import type { RegisterOptions } from 'react-hook-form'

import { validatePasswordsMatch } from '@/entities/auth'

import type { CreateNewPasswordFormValues } from './createNewPasswordFormValues'

export const PASSWORD_CONFIRMATION_RULES = {
  required: true,
  validate: {
    matches: (value, formValues) => validatePasswordsMatch(formValues.newPassword, value),
  },
} satisfies RegisterOptions<CreateNewPasswordFormValues, 'passwordConfirmation'>
