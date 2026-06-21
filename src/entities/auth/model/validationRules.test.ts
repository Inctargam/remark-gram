import { describe, expect, it } from 'vitest'

import {
  EMAIL_RULES,
  PASSWORD_CREATION_RULES,
  PASSWORD_LENGTH_RULES,
  PASSWORD_REQUIRED_LENGTH_RULES,
  PASSWORD_RULES,
  validatePasswordsMatch,
} from './validationRules'

describe('auth validation rules', () => {
  describe('EMAIL_RULES', () => {
    it.each([
      ['', true],
      ['user@example.com', true],
      ['user@example', 'The email must match the format example@example.com'],
    ])('validates %j', (value, expectedResult) => {
      expect(EMAIL_RULES.validate.pattern(value)).toBe(expectedResult)
    })
  })

  describe('PASSWORD_LENGTH_RULES', () => {
    it.each([
      ['', true, true],
      ['12345', 'Minimum number of characters 6', true],
      ['123456', true, true],
      ['12345678901234567890', true, true],
      ['123456789012345678901', true, 'Maximum number of characters 20'],
    ])('validates the length of %j', (value, expectedMinResult, expectedMaxResult) => {
      expect(PASSWORD_LENGTH_RULES.validate.minLength(value)).toBe(expectedMinResult)
      expect(PASSWORD_LENGTH_RULES.validate.maxLength(value)).toBe(expectedMaxResult)
    })
  })

  describe('PASSWORD_RULES', () => {
    const patternError =
      'Password must contain 0-9, a-z, A-Z, ! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ { | } ~'

    it.each([
      ['', true],
      ['Password1', true],
      ['password1', patternError],
      ['PASSWORD1', patternError],
      ['Password', patternError],
      ['Password1 ', patternError],
    ])('validates the composition of %j', (value, expectedResult) => {
      expect(PASSWORD_RULES.validate.pattern(value)).toBe(expectedResult)
    })
  })

  describe('PASSWORD_REQUIRED_LENGTH_RULES', () => {
    it('preserves the required password length configuration', () => {
      expect(PASSWORD_REQUIRED_LENGTH_RULES).toEqual({
        maxLength: {
          message: 'Your password must be between 6 and 20 characters',
          value: 20,
        },
        minLength: {
          message: 'Your password must be between 6 and 20 characters',
          value: 6,
        },
        required: 'Your password must be between 6 and 20 characters',
      })
    })
  })

  describe('PASSWORD_CREATION_RULES', () => {
    it('requires a password between 6 and 20 characters', () => {
      expect(PASSWORD_CREATION_RULES).toMatchObject(PASSWORD_REQUIRED_LENGTH_RULES)
    })

    it.each([
      ['Password1', true],
      [
        'password1',
        'Password must contain 0-9, a-z, A-Z, ! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ { | } ~',
      ],
    ])('validates the composition of %j', (value, expectedResult) => {
      expect(PASSWORD_CREATION_RULES.validate.pattern(value)).toBe(expectedResult)
    })
  })

  describe('validatePasswordsMatch', () => {
    it.each([
      ['Password1', '', true],
      ['Password1', 'Password1', true],
      ['Password1', 'Different1', 'Passwords must match'],
    ])('compares the password with %j confirmation', (password, confirmation, expectedResult) => {
      expect(validatePasswordsMatch(password, confirmation)).toBe(expectedResult)
    })
  })
})
