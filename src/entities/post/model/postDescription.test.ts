import { describe, expect, it } from 'vitest'

import {
  isValidPostDescription,
  normalizePostDescription,
  POST_DESCRIPTION_MAX_LENGTH,
} from './postDescription'

const createDescription = (length: number) => 'a'.repeat(length)

describe('isValidPostDescription', () => {
  it('accepts an empty description because the field is optional', () => {
    expect(isValidPostDescription('')).toBe(true)
  })

  it('accepts a description of exactly the maximum length', () => {
    expect(isValidPostDescription(createDescription(POST_DESCRIPTION_MAX_LENGTH))).toBe(true)
  })

  it('rejects a description longer than the maximum length', () => {
    expect(isValidPostDescription(createDescription(POST_DESCRIPTION_MAX_LENGTH + 1))).toBe(false)
  })
})

describe('normalizePostDescription', () => {
  it('keeps a description within the limit unchanged', () => {
    expect(normalizePostDescription('post description')).toBe('post description')
  })

  it('cuts a description down to the maximum length', () => {
    const normalized = normalizePostDescription(createDescription(POST_DESCRIPTION_MAX_LENGTH + 25))

    expect(normalized).toHaveLength(POST_DESCRIPTION_MAX_LENGTH)
  })
})
