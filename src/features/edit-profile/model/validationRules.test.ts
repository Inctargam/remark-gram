import { describe, expect, it } from 'vitest'

import {
  ABOUT_ME_MAX_LENGTH,
  ABOUT_ME_RULES,
  FIRST_NAME_RULES,
  isAtLeastMinimumAge,
  LAST_NAME_RULES,
  NAME_MAX_LENGTH,
  REQUIRED_FIELD_ERROR,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_RULES,
} from './validationRules'

type StringValidator = (value: string) => boolean | string

const getStringValidators = (validate: unknown): Record<string, StringValidator> => {
  if (!validate || typeof validate !== 'object') {
    throw new Error('Expected a validation map')
  }

  return validate as Record<string, StringValidator>
}

const USERNAME_VALIDATORS = getStringValidators(USERNAME_RULES.validate)
const FIRST_NAME_VALIDATORS = getStringValidators(FIRST_NAME_RULES.validate)
const LAST_NAME_VALIDATORS = getStringValidators(LAST_NAME_RULES.validate)
const ABOUT_ME_VALIDATORS = getStringValidators(ABOUT_ME_RULES.validate)

describe('edit profile text validation', () => {
  it('exposes the field length limits', () => {
    expect({
      usernameMin: USERNAME_MIN_LENGTH,
      usernameMax: USERNAME_MAX_LENGTH,
      nameMax: NAME_MAX_LENGTH,
      aboutMeMax: ABOUT_ME_MAX_LENGTH,
    }).toEqual({ usernameMin: 6, usernameMax: 30, nameMax: 50, aboutMeMax: 200 })
  })

  describe('username', () => {
    it('is required', () => {
      expect(USERNAME_RULES.required).toBe(REQUIRED_FIELD_ERROR)
    })

    it.each([
      ['     ', REQUIRED_FIELD_ERROR],
      ['user1', 'Minimum number of characters 6'],
      ['user12', true],
    ])('validates the minimum length and whitespace for %j', (value, expectedResult) => {
      const validator = value.trim()
        ? USERNAME_VALIDATORS.minLength
        : USERNAME_VALIDATORS.notWhitespace

      expect(validator(value)).toBe(expectedResult)
    })

    it.each([
      [30, true],
      [31, 'Maximum number of characters 30'],
    ])('validates the maximum length at %i characters', (length, expectedResult) => {
      expect(USERNAME_VALIDATORS.maxLength('a'.repeat(length))).toBe(expectedResult)
    })

    it.each([
      ['user_name-1', true],
      ['user.name', 'Username may only contain 0-9, A-Z, a-z, _ and -'],
    ])('validates the allowed characters in %j', (value, expectedResult) => {
      expect(USERNAME_VALIDATORS.pattern(value)).toBe(expectedResult)
    })
  })

  describe.each([
    {
      fieldName: 'first name',
      rules: FIRST_NAME_RULES,
      validators: FIRST_NAME_VALIDATORS,
      errorPrefix: 'First name',
    },
    {
      fieldName: 'last name',
      rules: LAST_NAME_RULES,
      validators: LAST_NAME_VALIDATORS,
      errorPrefix: 'Last name',
    },
  ])('$fieldName', ({ rules, validators, errorPrefix }) => {
    it('is required', () => {
      expect(rules.required).toBe(REQUIRED_FIELD_ERROR)
    })

    it('rejects whitespace', () => {
      expect(validators.notWhitespace('   ')).toBe(REQUIRED_FIELD_ERROR)
    })

    it.each([
      [50, true],
      [51, 'Maximum number of characters 50'],
    ])('validates the maximum length at %i characters', (length, expectedResult) => {
      expect(validators.maxLength('a'.repeat(length))).toBe(expectedResult)
    })

    it.each([
      ['John', true],
      ['АннаЁлкаё', true],
      ['Anne-Marie', 'error'],
      ['John2', 'error'],
    ])('validates the allowed characters in %j', (value, expectedResult) => {
      const result = validators.pattern(value)

      expect(result).toBe(
        expectedResult === 'error'
          ? `${errorPrefix} may only contain Latin and Cyrillic letters`
          : expectedResult
      )
    })
  })

  describe('about me', () => {
    it.each([
      [0, true],
      [200, true],
      [201, 'Maximum number of characters 200'],
    ])('validates the maximum length at %i characters', (length, expectedResult) => {
      expect(ABOUT_ME_VALIDATORS.maxLength('a'.repeat(length))).toBe(expectedResult)
    })
  })
})

describe('edit profile date validation', () => {
  const today = new Date(2026, 7, 7)

  it('accepts the exact thirteenth birthday', () => {
    expect(isAtLeastMinimumAge(new Date(2013, 7, 7), today)).toBe(true)
  })

  it('rejects a user whose thirteenth birthday is tomorrow', () => {
    expect(isAtLeastMinimumAge(new Date(2013, 7, 8), today)).toBe(false)
  })

  it('accepts an older user', () => {
    expect(isAtLeastMinimumAge(new Date(1990, 0, 1), today)).toBe(true)
  })

  it('rejects a leap-day birthday on February 28 in a non-leap year', () => {
    expect(isAtLeastMinimumAge(new Date(2012, 1, 29), new Date(2025, 1, 28))).toBe(false)
  })

  it('accepts a leap-day birthday on March 1 in a non-leap year', () => {
    expect(isAtLeastMinimumAge(new Date(2012, 1, 29), new Date(2025, 2, 1))).toBe(true)
  })

  it('handles a birthday across the year boundary', () => {
    const dateOfBirth = new Date(2014, 0, 1)

    expect(isAtLeastMinimumAge(dateOfBirth, new Date(2026, 11, 31))).toBe(false)
    expect(isAtLeastMinimumAge(dateOfBirth, new Date(2027, 0, 1))).toBe(true)
  })
})
