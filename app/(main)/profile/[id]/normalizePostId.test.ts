import { describe, expect, it } from 'vitest'

import { normalizePostId } from './normalizePostId'

describe('normalizePostId', () => {
  it('returns a single post id', () => {
    expect(normalizePostId('post-1')).toBe('post-1')
  })

  it('uses the first post id when query param is repeated', () => {
    expect(normalizePostId(['post-1', 'post-2'])).toBe('post-1')
  })

  it('returns null for an empty repeated query param', () => {
    expect(normalizePostId([])).toBeNull()
  })

  it('returns null when post id is missing', () => {
    expect(normalizePostId(undefined)).toBeNull()
  })
})
