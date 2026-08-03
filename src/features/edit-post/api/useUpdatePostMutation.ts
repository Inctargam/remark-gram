'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Post } from '@/entities/post'
import { postsQueryKeys, updatePost } from '@/entities/post'

/**
 * UC-2 saves the description and nothing else.
 * The edited post is cached twice — as a detail and inside the profile feed pages — so both
 * keys are invalidated; the feed is what the still-open post view reads from.
 */
export const useUpdatePostMutation = (post: Post) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (description: string) => updatePost(post.id, { description }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: postsQueryKeys.detail(post.id) }),
        queryClient.invalidateQueries({ queryKey: postsQueryKeys.list(post.ownerId) }),
      ]),
  })
}
