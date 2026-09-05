import { hydrate, QueryClient } from '@tanstack/react-query'
import { afterEach, describe, expect, it } from 'vitest'

import type { PostsPage } from '../model/types'
import { prefetchProfilePostsQueryServer } from './profilePostsHydration.server'
import { postsQueryKeys } from './queryKeys'

const ORIGINAL_POSTS_API_MOCK = process.env.NEXT_PUBLIC_POSTS_API_MOCK

describe('prefetchProfilePostsQueryServer', () => {
  afterEach(() => {
    process.env.NEXT_PUBLIC_POSTS_API_MOCK = ORIGINAL_POSTS_API_MOCK
  })

  it('hydrates the first profile posts page into the TanStack cache', async () => {
    const prefetchedPosts = await prefetchProfilePostsQueryServer('mock-user-1')
    const queryClient = new QueryClient()

    expect(prefetchedPosts).not.toBeNull()

    hydrate(queryClient, prefetchedPosts?.dehydratedState)

    const data = queryClient.getQueryData<{
      pages: PostsPage[]
      pageParams: Array<string | null>
    }>(postsQueryKeys.list('mock-user-1'))

    expect(data?.pages[0]?.items[0]?.ownerId).toBe('mock-user-1')
    expect(data?.pageParams).toEqual([null])
  })

  it('hydrates an empty posts page when the store has no posts for the user', async () => {
    const prefetchedPosts = await prefetchProfilePostsQueryServer('unknown-user')
    const queryClient = new QueryClient()

    expect(prefetchedPosts).not.toBeNull()

    hydrate(queryClient, prefetchedPosts?.dehydratedState)

    const data = queryClient.getQueryData<{
      pages: PostsPage[]
      pageParams: Array<string | null>
    }>(postsQueryKeys.list('unknown-user'))

    expect(data?.pages[0]).toEqual({ items: [], nextCursor: null })
  })

  it('does not hydrate a mock posts page for backend numeric profile ids', async () => {
    process.env.NEXT_PUBLIC_POSTS_API_MOCK = 'false'

    const prefetchedPosts = await prefetchProfilePostsQueryServer('3')
    const queryClient = new QueryClient()

    expect(prefetchedPosts).not.toBeNull()

    hydrate(queryClient, prefetchedPosts?.dehydratedState)

    expect(queryClient.getQueryData(postsQueryKeys.list('3'))).toBeUndefined()
  })
})
