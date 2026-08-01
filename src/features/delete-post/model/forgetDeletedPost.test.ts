import { describe, expect, it, vi } from 'vitest'

import { postsQueryKeys } from '@/entities/post'

import { forgetDeletedPost } from './forgetDeletedPost'

const createCache = () => ({
  invalidateQueries: vi.fn().mockResolvedValue(undefined),
  removeQueries: vi.fn(),
})

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
