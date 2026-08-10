import { findPost, listPosts } from '@/shared/api/mock/postsStore'

import type { Post, PostsPage } from '../model/types'
import { PROFILE_POSTS_PAGE_SIZE } from './postsApi'

type GetProfilePostsServerParams = {
  userId: string
  cursor?: string | null
  pageSize?: number
}

export const getProfilePostsServer = ({
  userId,
  cursor,
  pageSize = PROFILE_POSTS_PAGE_SIZE,
}: GetProfilePostsServerParams): PostsPage | null => listPosts({ userId, cursor, pageSize })

export const getPostServer = (postId: string): Post | null => findPost(postId)
