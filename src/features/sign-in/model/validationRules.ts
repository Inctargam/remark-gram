import type { RegisterOptions } from 'react-hook-form'

import type { SignInFormValues } from './signInFormValues'

// Validation runs on blur (mode: 'onBlur').
// Empty-field errors are suppressed with `!val` — the submit button is already
// disabled via hasAllValues in useSignInForm, so "required" errors on blur
// would be premature and confusing.

export const EMAIL_RULES: RegisterOptions<SignInFormValues, 'email'> = {
  validate: {
    pattern: (val) =>
      !val ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
      'The email must match the format example@example.com',
  },
}

export const PASSWORD_RULES: RegisterOptions<SignInFormValues, 'password'> = {
  validate: {
    minLength: (val) => !val || val.length >= 6 || 'Minimum number of characters 6',
    maxLength: (val) => !val || val.length <= 20 || 'Maximum number of characters 20',
  },
}
