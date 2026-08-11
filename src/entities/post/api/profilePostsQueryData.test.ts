import { describe, expect, it } from 'vitest'

import type { PostsPage } from '../model/types'
import { createProfilePostsInitialData } from './profilePostsQueryData'

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

describe('createProfilePostsInitialData', () => {
  it('does not seed the infinite query without an initial page', () => {
    expect(createProfilePostsInitialData(undefined)).toBeUndefined()
  })

  it('wraps the initial posts page into TanStack infinite query data', () => {
    expect(createProfilePostsInitialData(initialPage)).toEqual({
      pages: [initialPage],
      pageParams: [null],
    })
  })
})
