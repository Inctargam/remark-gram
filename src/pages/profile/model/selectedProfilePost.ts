import type { Post } from '@/entities/post'

export const isSelectedProfilePost = (post: Post, userId: string): boolean =>
  post.ownerId === userId
