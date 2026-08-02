import type { QueryClient } from '@tanstack/react-query'

import { postsQueryKeys } from '@/entities/post'

/** Only the cache calls the mutation needs — lets the unit test pass a plain object. */
type PostsCache = Pick<QueryClient, 'invalidateQueries' | 'removeQueries'>

type DeletedPost = {
  postId: string
  ownerId: string
}

/**
 * Cache cleanup after UC-3. The detail entry is dropped rather than invalidated: an
 * invalidated key would refetch a post that no longer exists and answer 404. The profile
 * feed is only invalidated — it stays on screen and must reload without the deleted post.
 *
 * Kept out of the hook so it can be covered by the `node` unit project.
 */
export const forgetDeletedPost = async (cache: PostsCache, { postId, ownerId }: DeletedPost) => {
  cache.removeQueries({ queryKey: postsQueryKeys.detail(postId) })

  await cache.invalidateQueries({ queryKey: postsQueryKeys.list(ownerId) })
}
