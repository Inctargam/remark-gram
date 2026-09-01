import { ApiError } from '@/shared/api/baseApi'

import type { PostsPage } from '../model/types'

export const PROFILE_POSTS_INITIAL_PAGE_PARAM: string | null = null
export const PROFILE_POSTS_STALE_TIME_MS = 30_000
const PROFILE_POSTS_RETRY_COUNT = 3

export const getProfilePostsNextPageParam = ({ nextCursor }: PostsPage) => nextCursor

export const shouldRetryProfilePostsQuery = (failureCount: number, error: Error) => {
  const isClientError = error instanceof ApiError && error.status >= 400 && error.status < 500

  if (isClientError) {
    return false
  }

  return failureCount < PROFILE_POSTS_RETRY_COUNT
}
