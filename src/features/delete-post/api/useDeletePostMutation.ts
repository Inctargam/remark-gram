'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Post } from '@/entities/post'
import { deletePost } from '@/entities/post'

import { forgetDeletedPost } from '../model/forgetDeletedPost'

/** UC-3: the post is removed, then the cache is brought in line with the new feed. */
export const useDeletePostMutation = (post: Post) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deletePost(post.id),
    onSuccess: () => forgetDeletedPost(queryClient, { postId: post.id, ownerId: post.ownerId }),
  })
}
