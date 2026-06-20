import type { RegisterOptions } from 'react-hook-form'

import type { SignUpFormValues } from './signUpFormValues'

// Validation runs on blur (mode: 'onBlur').
// Empty-field errors are suppressed with `!val` — the submit button is already
// disabled via hasAllValues in useSignUpForm, so "required" errors on blur
// would be premature and confusing.

export const USERNAME_RULES: RegisterOptions<SignUpFormValues, 'username'> = {
  validate: {
    minLength: (val) => !val || val.length >= 6 || 'Minimum number of characters 6',
    maxLength: (val) => !val || val.length <= 30 || 'Maximum number of characters 30',
    pattern: (val) =>
      !val || /^[0-9A-Za-z_-]+$/.test(val) || 'Username may only contain 0-9, A-Z, a-z, _ and -',
  },
}

export const EMAIL_RULES: RegisterOptions<SignUpFormValues, 'email'> = {
  validate: {
    pattern: (val) =>
      !val ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
      'The email must match the format example@example.com',
  },
}

export const PASSWORD_RULES: RegisterOptions<SignUpFormValues, 'password'> = {
  validate: {
    minLength: (val) => !val || val.length >= 6 || 'Minimum number of characters 6',
    maxLength: (val) => !val || val.length <= 20 || 'Maximum number of characters 20',
    pattern: (val) =>
      !val ||
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z!"#$%&'()*+,\-./:;<=>?@[\\\]^_{|}~]+$/.test(
        val
      ) ||
      'Password must contain 0-9, a-z, A-Z, ! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ { | } ~',
  },
}

export const PASSWORD_CONFIRMATION_RULES: RegisterOptions<
  SignUpFormValues,
  'passwordConfirmation'
> = {
  validate: {
    matches: (val, formValues) => !val || val === formValues.password || 'Passwords must match',
  },
}
