'use client'

import { useInfiniteQuery } from '@tanstack/react-query'

import { flattenPostsPages } from '../lib/flattenPostsPages'
import { canRequestProfilePosts, getProfilePosts, PROFILE_POSTS_PAGE_SIZE } from './postsApi'
import {
  getProfilePostsNextPageParam,
  PROFILE_POSTS_INITIAL_PAGE_PARAM,
  PROFILE_POSTS_STALE_TIME_MS,
  shouldRetryProfilePostsQuery,
} from './profilePostsQueryData'
import { postsQueryKeys } from './queryKeys'

/**
 * Profile feed, page by page. The backend sorts newest first, the client never re-sorts.
 * `pageParam` is the cursor: `null` asks for the first page, `nextCursor` for the following one.
 */
export const useProfilePostsQuery = (userId: string) => {
  const canFetchProfilePosts = canRequestProfilePosts(userId)
  const { data, ...query } = useInfiniteQuery({
    queryKey: postsQueryKeys.list(userId),
    queryFn: ({ pageParam }) =>
      getProfilePosts({ userId, cursor: pageParam, pageSize: PROFILE_POSTS_PAGE_SIZE }),
    enabled: canFetchProfilePosts,
    initialPageParam: PROFILE_POSTS_INITIAL_PAGE_PARAM,
    getNextPageParam: getProfilePostsNextPageParam,
    retry: shouldRetryProfilePostsQuery,
    staleTime: PROFILE_POSTS_STALE_TIME_MS,
  })

  return {
    ...query,
    hasNextPage: canFetchProfilePosts ? query.hasNextPage : false,
    posts: flattenPostsPages(data?.pages),
  }
}
