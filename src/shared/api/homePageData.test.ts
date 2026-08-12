import { beforeEach, describe, expect, it } from 'vitest'

import { getHomePagePosts, getHomePageUsersCount } from './homePageData'
import { resetPostsMockStore } from './mock/postsStore'

beforeEach(() => {
  resetPostsMockStore()
})

describe('getHomePagePosts', () => {
  it('returns the latest posts for SSR home composition', async () => {
    await expect(getHomePagePosts()).resolves.toMatchObject({
      items: [
        { id: 'mock-user-1-post-01' },
        { id: 'mock-user-1-post-02' },
        { id: 'mock-user-1-post-03' },
        { id: 'mock-user-1-post-04' },
      ],
    })
  })
})

describe('getHomePageUsersCount', () => {
  it('returns the registered users counter for SSR home composition', async () => {
    await expect(getHomePageUsersCount()).resolves.toEqual({ totalCount: 2150 })
  })
})
