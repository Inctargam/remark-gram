import { describe, expect, it } from 'vitest'

import type { Post, PostsPage } from '../model/types'
import { flattenPostsPages } from './flattenPostsPages'

const createPost = (id: string): Post => ({
  id,
  ownerId: 'mock-user-1',
  ownerUsername: 'UserName',
  ownerAvatarUrl: null,
  images: [{ url: 'data:image/svg+xml;utf8,<svg/>', width: 1080, height: 1080 }],
  description: `Post ${id}`,
  createdAt: '2026-07-01T12:00:00.000Z',
  updatedAt: '2026-07-01T12:00:00.000Z',
})

const createPage = (ids: string[], nextCursor: string | null = null): PostsPage => ({
  items: ids.map(createPost),
  nextCursor,
})

describe('flatten posts pages', () => {
  it('returns an empty list when the query has no data yet', () => {
    expect(flattenPostsPages(undefined)).toEqual([])
  })

  it('keeps the order pages arrived in', () => {
    const posts = flattenPostsPages([createPage(['1', '2'], '3'), createPage(['3', '4'])])

    expect(posts.map(({ id }) => id)).toEqual(['1', '2', '3', '4'])
  })

  it('drops posts repeated across pages', () => {
    const posts = flattenPostsPages([createPage(['1', '2'], '2'), createPage(['2', '3'])])

    expect(posts.map(({ id }) => id)).toEqual(['1', '2', '3'])
  })
})
