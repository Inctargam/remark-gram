'use client'

import { useInfiniteQuery } from '@tanstack/react-query'

import { flattenPostsPages } from '../lib/flattenPostsPages'
import type { PostsPage } from '../model/types'
import { getProfilePosts, PROFILE_POSTS_PAGE_SIZE } from './postsApi'
import {
  createProfilePostsInitialData,
  PROFILE_POSTS_INITIAL_STALE_TIME_MS,
} from './profilePostsQueryData'
import { postsQueryKeys } from './queryKeys'

/**
 * Profile feed, page by page. The backend sorts newest first, the client never re-sorts.
 * `pageParam` is the cursor: `null` asks for the first page, `nextCursor` for the following one.
 */
export const useProfilePostsQuery = (userId: string, initialPage?: PostsPage) => {
  const { data, ...query } = useInfiniteQuery({
    queryKey: postsQueryKeys.list(userId),
    queryFn: ({ pageParam }) =>
      getProfilePosts({ userId, cursor: pageParam, pageSize: PROFILE_POSTS_PAGE_SIZE }),
    initialData: createProfilePostsInitialData(initialPage),
    initialPageParam: null as string | null,
    getNextPageParam: ({ nextCursor }) => nextCursor,
    staleTime: initialPage ? PROFILE_POSTS_INITIAL_STALE_TIME_MS : 0,
  })

  return { ...query, posts: flattenPostsPages(data?.pages) }
}
