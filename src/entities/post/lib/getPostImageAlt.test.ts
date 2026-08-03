import { describe, expect, it } from 'vitest'

import type { Post } from '../model/types'
import { getPostImageAlt } from './getPostImageAlt'

const createPost = (description: string): Post => ({
  id: 'post-1',
  ownerId: 'user-1',
  ownerUsername: 'UserName',
  ownerAvatarUrl: null,
  images: [{ url: 'https://example.com/photo.jpg', width: 1080, height: 1080 }],
  description,
  createdAt: '2026-07-01T12:00:00.000Z',
  updatedAt: '2026-07-01T12:00:00.000Z',
})

describe('getPostImageAlt', () => {
  it('uses the description as the alt text', () => {
    expect(getPostImageAlt(createPost('Sunset over the lake'))).toBe('Sunset over the lake')
  })

  it('falls back to the author when the post has no description', () => {
    expect(getPostImageAlt(createPost('   '))).toBe('Publication by UserName')
  })

  it('takes the first line of a multiline description', () => {
    expect(getPostImageAlt(createPost('First line\nSecond line'))).toBe('First line')
  })

  it('truncates a long description', () => {
    const alt = getPostImageAlt(createPost('word '.repeat(40)))

    expect(alt).toHaveLength(80)
    expect(alt.endsWith('…')).toBe(true)
  })
})
