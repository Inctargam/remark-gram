import { api } from '@/shared/api/baseApi'

import type { Post, PostsPage } from '../model/types'

/**
 * The only place that talks to the posts API. Hooks and UI never call `fetch` directly,
 * so switching from the in-memory mock to the real backend is a change in this file alone.
 *
 * Paths mirror the future real ones and differ by prefix only:
 * mock `/api/mock/posts`, real `/api/v1/posts` (`/api` comes from NEXT_PUBLIC_API_BASE_URL).
 *
 * TODO(posts-schema): replace hand-written types and paths with the generated
 * openapi-fetch client once posts endpoints appear in `schema.d.ts`.
 */
const MOCK_POSTS_PATH = '/mock/posts'
const REAL_POSTS_PATH = '/v1/posts'

export const PROFILE_POSTS_PAGE_SIZE = 8

/** Read at call time, not at module load, so tests can flip the flag. */
const getPostsBasePath = () =>
  process.env.NEXT_PUBLIC_POSTS_API_MOCK === 'true' ? MOCK_POSTS_PATH : REAL_POSTS_PATH

type GetProfilePostsParams = {
  userId: string
  cursor?: string | null
  pageSize?: number
}

export const getProfilePosts = async ({
  userId,
  cursor,
  pageSize = PROFILE_POSTS_PAGE_SIZE,
}: GetProfilePostsParams): Promise<PostsPage> => {
  const searchParams = new URLSearchParams({ userId, pageSize: String(pageSize) })

  if (cursor) {
    searchParams.set('cursor', cursor)
  }

  const response = await api.get(`${getPostsBasePath()}?${searchParams.toString()}`)

  return response.json()
}

export const getPost = async (postId: string): Promise<Post> => {
  const response = await api.get(`${getPostsBasePath()}/${postId}`)

  return response.json()
}

export type UpdatePostPayload = {
  description: string
}

export const updatePost = async (postId: string, payload: UpdatePostPayload): Promise<Post> => {
  const response = await api.patch(`${getPostsBasePath()}/${postId}`, payload)

  return response.json()
}

export const deletePost = async (postId: string): Promise<void> => {
  await api.delete(`${getPostsBasePath()}/${postId}`)
}
