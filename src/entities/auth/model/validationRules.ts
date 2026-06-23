import type { RegisterOptions } from 'react-hook-form'

const MIN_PASSWORD_LENGTH = 6
const MAX_PASSWORD_LENGTH = 20
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_PATTERN =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z!"#$%&'()*+,\-./:;<=>?@[\\\]^_{|}~]+$/

const EMAIL_PATTERN_ERROR = 'The email must match the format example@example.com'
const PASSWORD_MIN_LENGTH_ERROR = 'Minimum number of characters 6'
const PASSWORD_MAX_LENGTH_ERROR = 'Maximum number of characters 20'
const PASSWORD_PATTERN_ERROR =
  'Password must contain 0-9, a-z, A-Z, ! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ { | } ~'
const PASSWORDS_MATCH_ERROR = 'Passwords must match'

export const EMAIL_RULES = {
  validate: {
    pattern: (value: string) => !value || EMAIL_PATTERN.test(value) || EMAIL_PATTERN_ERROR,
  },
} satisfies RegisterOptions

export const PASSWORD_LENGTH_RULES = {
  validate: {
    minLength: (value: string) =>
      !value || value.length >= MIN_PASSWORD_LENGTH || PASSWORD_MIN_LENGTH_ERROR,
    maxLength: (value: string) =>
      !value || value.length <= MAX_PASSWORD_LENGTH || PASSWORD_MAX_LENGTH_ERROR,
  },
} satisfies RegisterOptions

const PASSWORD_RULES = {
  validate: {
    ...PASSWORD_LENGTH_RULES.validate,
    pattern: (value: string) => !value || PASSWORD_PATTERN.test(value) || PASSWORD_PATTERN_ERROR,
  },
} satisfies RegisterOptions

export const PASSWORD_CREATION_RULES = {
  required: true,
  validate: PASSWORD_RULES.validate,
} satisfies RegisterOptions

export const validatePasswordsMatch = (password: string, passwordConfirmation: string) =>
  !passwordConfirmation || passwordConfirmation === password || PASSWORDS_MATCH_ERROR
