import { describe, expect, it } from 'vitest'

import type { CreateNewPasswordFormValues } from './createNewPasswordFormValues'
import { PASSWORD_CONFIRMATION_RULES } from './validationRules'

describe('PASSWORD_CONFIRMATION_RULES', () => {
  const formValues: CreateNewPasswordFormValues = {
    newPassword: 'Password1',
    passwordConfirmation: '',
  }

  it('accepts a matching password confirmation', () => {
    expect(PASSWORD_CONFIRMATION_RULES.validate.matches('Password1', formValues)).toBe(true)
  })

  it('rejects a different password confirmation', () => {
    expect(PASSWORD_CONFIRMATION_RULES.validate.matches('Different1', formValues)).toBe(
      'Passwords must match'
    )
  })
})
