import { describe, expect, it } from 'vitest'

import type { PostsPage } from '../model/types'
import {
  getProfilePostsNextPageParam,
  PROFILE_POSTS_INITIAL_PAGE_PARAM,
  PROFILE_POSTS_STALE_TIME_MS,
} from './profilePostsQueryData'

const initialPage: PostsPage = {
  items: [
    {
      id: 'post-1',
      ownerId: 'user-1',
      ownerUsername: 'user.one',
      ownerAvatarUrl: null,
      images: [{ url: '/images/post-1.jpg', width: 640, height: 640 }],
      description: 'First post',
      createdAt: '2026-08-11T09:00:00.000Z',
      updatedAt: '2026-08-11T09:00:00.000Z',
    },
  ],
  nextCursor: 'post-2',
}

describe('profile posts query data', () => {
  it('uses null as the first infinite query page param', () => {
    expect(PROFILE_POSTS_INITIAL_PAGE_PARAM).toBeNull()
  })

  it('uses a short stale time for SSR-hydrated profile posts', () => {
    expect(PROFILE_POSTS_STALE_TIME_MS).toBe(30_000)
  })

  it('reads the next cursor from a posts page', () => {
    expect(getProfilePostsNextPageParam(initialPage)).toBe('post-2')
  })
})
