import type { InfiniteData } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'

import type { PostsPage } from '@/entities/post'
import { postsQueryKeys } from '@/entities/post'

import { forgetDeletedPost } from './forgetDeletedPost'

const createCache = () => ({
  invalidateQueries: vi.fn().mockResolvedValue(undefined),
  removeQueries: vi.fn(),
  setQueriesData: vi.fn(),
})

const POSTS_PAGE: PostsPage = {
  items: [
    {
      id: 'post-1',
      ownerId: 'user-1',
      ownerUsername: 'UserName',
      ownerAvatarUrl: null,
      images: [],
      description: 'Deleted post',
      createdAt: '2026-08-24T10:00:00.000Z',
      updatedAt: '2026-08-24T10:00:00.000Z',
    },
    {
      id: 'post-2',
      ownerId: 'user-1',
      ownerUsername: 'UserName',
      ownerAvatarUrl: null,
      images: [],
      description: 'Visible post',
      createdAt: '2026-08-24T09:00:00.000Z',
      updatedAt: '2026-08-24T09:00:00.000Z',
    },
  ],
  nextCursor: null,
}

describe('forgetDeletedPost', () => {
  it('drops the cached detail of the deleted post', async () => {
    const cache = createCache()

    await forgetDeletedPost(cache, { postId: 'post-1', ownerId: 'user-1' })

    expect(cache.removeQueries).toHaveBeenCalledWith({
      queryKey: postsQueryKeys.detail('post-1'),
    })
  })

  it('invalidates the profile feed of the owner', async () => {
    const cache = createCache()

    await forgetDeletedPost(cache, { postId: 'post-1', ownerId: 'user-1' })

    expect(cache.invalidateQueries).toHaveBeenCalledWith({
      queryKey: postsQueryKeys.list('user-1'),
    })
  })

  it('removes the deleted post from cached owner feed pages', async () => {
    const cache = createCache()

    await forgetDeletedPost(cache, { postId: 'post-1', ownerId: 'user-1' })

    const updater = cache.setQueriesData.mock.calls[0]?.[1]
    const result = updater?.({ pageParams: [null], pages: [POSTS_PAGE] }) as
      | InfiniteData<PostsPage, string | null>
      | undefined

    expect(cache.setQueriesData).toHaveBeenCalledWith(
      { queryKey: postsQueryKeys.list('user-1') },
      expect.any(Function)
    )
    expect(result?.pages[0]?.items.map(({ id }) => id)).toEqual(['post-2'])
  })

  it('leaves feeds of other users alone', async () => {
    const cache = createCache()

    await forgetDeletedPost(cache, { postId: 'post-1', ownerId: 'user-1' })

    expect(cache.invalidateQueries).toHaveBeenCalledTimes(1)
    expect(cache.invalidateQueries).not.toHaveBeenCalledWith({
      queryKey: postsQueryKeys.list('user-2'),
    })
  })

  it('waits for the feed refetch before resolving', async () => {
    const cache = createCache()
    let isRefetchDone = false

    cache.invalidateQueries.mockImplementation(async () => {
      isRefetchDone = true
    })

    await forgetDeletedPost(cache, { postId: 'post-1', ownerId: 'user-1' })

    expect(isRefetchDone).toBe(true)
  })
})
