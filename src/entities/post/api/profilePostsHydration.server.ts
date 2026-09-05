import type { DehydratedState } from '@tanstack/react-query'
import { dehydrate, QueryClient } from '@tanstack/react-query'

import { PROFILE_POSTS_PAGE_SIZE } from './postsApi'
import { getProfilePostsServer } from './postsApi.server'
import {
  getProfilePostsNextPageParam,
  PROFILE_POSTS_INITIAL_PAGE_PARAM,
  PROFILE_POSTS_STALE_TIME_MS,
} from './profilePostsQueryData'
import { postsQueryKeys } from './queryKeys'

type PrefetchedProfilePosts = {
  dehydratedState: DehydratedState
}

const isMockPostsApi = () => process.env.NEXT_PUBLIC_POSTS_API_MOCK === 'true'

const isBackendProfileUserId = (userId: string) => /^[1-9]\d*$/.test(userId)

export const prefetchProfilePostsQueryServer = async (
  userId: string
): Promise<PrefetchedProfilePosts | null> => {
  const queryClient = new QueryClient()

  if (!isMockPostsApi() && isBackendProfileUserId(userId)) {
    return { dehydratedState: dehydrate(queryClient) }
  }

  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey: postsQueryKeys.list(userId),
      queryFn: ({ pageParam }) => {
        const page = getProfilePostsServer({
          userId,
          cursor: pageParam,
          pageSize: PROFILE_POSTS_PAGE_SIZE,
        })

        if (!page) {
          throw new Error(`Profile posts not found for user "${userId}"`)
        }

        return page
      },
      initialPageParam: PROFILE_POSTS_INITIAL_PAGE_PARAM,
      getNextPageParam: getProfilePostsNextPageParam,
      staleTime: PROFILE_POSTS_STALE_TIME_MS,
    })
  } catch {
    return null
  }

  return { dehydratedState: dehydrate(queryClient) }
}
