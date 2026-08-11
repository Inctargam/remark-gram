import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  clearEditProfileDraft,
  consumeEditProfileDraft,
  EDIT_PROFILE_DRAFT_KEY,
  saveEditProfileDraft,
} from './editProfileDraft'
import type { EditProfileFormValues } from './editProfileFormValues'

const VALUES: EditProfileFormValues = {
  username: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: new Date(2013, 7, 8),
  country: 'United States',
  region: 'Texas',
  city: 'Austin',
  aboutMe: 'Draft',
}

const createSessionStorage = () => {
  const values = new Map<string, string>()

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  }
}

beforeEach(() => {
  vi.stubGlobal('window', { sessionStorage: createSessionStorage() })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('edit profile privacy policy draft', () => {
  it('restores all values and consumes the draft once', () => {
    saveEditProfileDraft(VALUES)

    expect(consumeEditProfileDraft()).toEqual(VALUES)
    expect(consumeEditProfileDraft()).toBeNull()
  })

  it('clears a saved draft', () => {
    saveEditProfileDraft(VALUES)
    clearEditProfileDraft()

    expect(consumeEditProfileDraft()).toBeNull()
  })

  it('restores a draft without a date of birth', () => {
    const valuesWithoutDate = { ...VALUES, dateOfBirth: null }

    saveEditProfileDraft(valuesWithoutDate)

    expect(consumeEditProfileDraft()).toEqual(valuesWithoutDate)
  })

  it.each([
    ['malformed JSON', '{invalid-json'],
    [
      'a missing field',
      JSON.stringify({
        username: VALUES.username,
        firstName: VALUES.firstName,
        lastName: VALUES.lastName,
        dateOfBirth: '2013-08-08',
        country: VALUES.country,
        region: VALUES.region,
        city: VALUES.city,
      }),
    ],
    [
      'a field with an invalid type',
      JSON.stringify({ ...VALUES, username: 123, dateOfBirth: '2013-08-08' }),
    ],
    ['an invalid date', JSON.stringify({ ...VALUES, dateOfBirth: '2013-02-30' })],
  ])('discards a stored draft containing %s', (_caseName, storedValue) => {
    window.sessionStorage.setItem(EDIT_PROFILE_DRAFT_KEY, storedValue)

    expect(consumeEditProfileDraft()).toBeNull()
    expect(window.sessionStorage.getItem(EDIT_PROFILE_DRAFT_KEY)).toBeNull()
  })

  it('is safe to use during server rendering', () => {
    vi.unstubAllGlobals()

    expect(() => saveEditProfileDraft(VALUES)).not.toThrow()
    expect(consumeEditProfileDraft()).toBeNull()
    expect(() => clearEditProfileDraft()).not.toThrow()
  })
})
