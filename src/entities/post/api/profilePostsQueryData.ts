import type { InfiniteData } from '@tanstack/react-query'

import type { PostsPage } from '../model/types'

export const PROFILE_POSTS_INITIAL_STALE_TIME_MS = 30_000

export const createProfilePostsInitialData = (
  initialPage: PostsPage | undefined
): InfiniteData<PostsPage, string | null> | undefined => {
  if (!initialPage) {
    return undefined
  }

  return {
    pages: [initialPage],
    pageParams: [null],
  }
}
