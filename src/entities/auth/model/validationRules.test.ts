import { describe, expect, it } from 'vitest'

import {
  EMAIL_RULES,
  PASSWORD_CREATION_RULES,
  PASSWORD_LENGTH_RULES,
  validatePasswordsMatch,
} from '@/entities/auth'

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

  describe('PASSWORD_CREATION_RULES', () => {
    it('requires a password without an error message', () => {
      expect(PASSWORD_CREATION_RULES.required).toBe(true)
    })

    it('includes the password length validation', () => {
      expect(PASSWORD_CREATION_RULES.validate.minLength('12345')).toBe(
        'Minimum number of characters 6'
      )
      expect(PASSWORD_CREATION_RULES.validate.maxLength('123456789012345678901')).toBe(
        'Maximum number of characters 20'
      )
    })

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
