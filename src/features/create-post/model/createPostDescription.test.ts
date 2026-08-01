import { describe, expect, it } from 'vitest'

import {
  CREATE_POST_DESCRIPTION_MAX_LENGTH,
  normalizeCreatePostDescription,
} from './createPostDescription'

describe('create post description', () => {
  it('keeps descriptions within the publication limit', () => {
    const description = 'a'.repeat(CREATE_POST_DESCRIPTION_MAX_LENGTH)

    expect(normalizeCreatePostDescription(description)).toBe(description)
  })

  it('trims descriptions longer than the publication limit', () => {
    const description = 'a'.repeat(CREATE_POST_DESCRIPTION_MAX_LENGTH + 1)

    expect(normalizeCreatePostDescription(description)).toHaveLength(
      CREATE_POST_DESCRIPTION_MAX_LENGTH
    )
  })
})
