import { api } from '@/shared/api/baseApi'

import type { Post, PostImage, PostsPage } from '../model/types'

/**
 * The only place that talks to the posts API. Hooks and UI never call `fetch` directly,
 * so switching from the in-memory mock to the real backend is a change in this file alone.
 *
 * Paths mirror the future real ones and differ by prefix only:
 * mock `/api/mock/posts`, real `${NEXT_PUBLIC_API_BASE_URL}/api/v1/posts` — the same shape
 * the auth calls use, so the base url carries the host only.
 *
 * The mock lives in `app/api/mock/posts` — a route handler of this very app, so it is
 * requested on the current origin and must not inherit the backend base url. Auth already
 * points that base url at the real backend; sharing it would send mock calls to the wrong host.
 *
 * TODO(posts-schema): replace hand-written types and paths with the generated
 * openapi-fetch client once posts endpoints appear in `schema.d.ts`.
 */
const MOCK_POSTS_PATH = '/api/mock/posts'
const REAL_POSTS_PATH = '/api/v1/posts'

export const PROFILE_POSTS_PAGE_SIZE = 8

/** Read at call time, not at module load, so tests can flip the flag. */
const isMockPostsApi = () => process.env.NEXT_PUBLIC_POSTS_API_MOCK === 'true'

const getPostsBasePath = () => (isMockPostsApi() ? MOCK_POSTS_PATH : REAL_POSTS_PATH)

/** Empty base url keeps mock calls on the current origin; real ones fall back to the API base. */
const getPostsRequestInit = () => (isMockPostsApi() ? { baseUrl: '' } : undefined)

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

  const response = await api.get(
    `${getPostsBasePath()}?${searchParams.toString()}`,
    getPostsRequestInit()
  )

  return response.json()
}

export const getPost = async (postId: string): Promise<Post> => {
  const response = await api.get(`${getPostsBasePath()}/${postId}`, getPostsRequestInit())

  return response.json()
}

export type CreatePostPayload = {
  description: string
  images: PostImage[]
}

export const createPost = async (payload: CreatePostPayload): Promise<Post> => {
  const response = await api.post(getPostsBasePath(), payload, getPostsRequestInit())

  return response.json()
}

export type UpdatePostPayload = {
  description: string
}

export const updatePost = async (postId: string, payload: UpdatePostPayload): Promise<Post> => {
  const response = await api.patch(
    `${getPostsBasePath()}/${postId}`,
    payload,
    getPostsRequestInit()
  )

  return response.json()
}

export const deletePost = async (postId: string): Promise<void> => {
  await api.delete(`${getPostsBasePath()}/${postId}`, getPostsRequestInit())
}
