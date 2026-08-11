import { describe, expect, it } from 'vitest'

import type { Post } from '@/entities/post'

import { isSelectedProfilePost } from './selectedProfilePost'

const post: Post = {
  id: 'post-1',
  ownerId: 'user-1',
  ownerUsername: 'UserName',
  ownerAvatarUrl: null,
  images: [{ url: 'https://example.com/photo.jpg', width: 1080, height: 1080 }],
  description: 'Mock publication',
  createdAt: '2026-07-01T12:00:00.000Z',
  updatedAt: '2026-07-01T12:00:00.000Z',
}

describe('isSelectedProfilePost', () => {
  it('returns true when the post belongs to the profile user', () => {
    expect(isSelectedProfilePost(post, 'user-1')).toBe(true)
  })

  it('returns false when the post belongs to another user', () => {
    expect(isSelectedProfilePost(post, 'user-2')).toBe(false)
  })
})
