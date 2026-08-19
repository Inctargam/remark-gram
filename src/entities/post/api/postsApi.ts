import { api } from '@/shared/api/baseApi'
import type { SchemaGetAuthorPostsDto } from '@/shared/api/openapi/schema'

import type { Post, PostsPage } from '../model/types'

/**
 * The only place that talks to the posts API. Hooks and UI never call `fetch` directly,
 * so switching from the in-memory mock to the real backend is a change in this file alone.
 *
 * Mock and real list endpoints have different shapes:
 * mock `/api/mock/posts?userId=...&pageSize=...`, real
 * `${NEXT_PUBLIC_API_BASE_URL}/api/v1/users/{userId}/posts?limit=...`.
 * Keep that difference hidden here so hooks and UI stay stable.
 *
 * The mock lives in `app/api/mock/posts` — a route handler of this very app, so it is
 * requested on the current origin and must not inherit the backend base url. Auth already
 * points that base url at the real backend; sharing it would send mock calls to the wrong host.
 *
 * TODO(posts-schema): replace hand-written response mapping with the generated
 * openapi-fetch client once the UI post model matches the backend author post DTO.
 */
const MOCK_POSTS_PATH = '/api/mock/posts'
const REAL_POSTS_PATH = '/api/v1/posts'
const REAL_AUTHOR_POSTS_PATH = '/api/v1/users'

export const PROFILE_POSTS_PAGE_SIZE = 8

/** Read at call time, not at module load, so tests can flip the flag. */
const isMockPostsApi = () => process.env.NEXT_PUBLIC_POSTS_API_MOCK === 'true'

const getPostsBasePath = () => (isMockPostsApi() ? MOCK_POSTS_PATH : REAL_POSTS_PATH)

/** Empty base url keeps mock calls on the current origin; real ones fall back to the API base. */
const getPostsRequestInit = () => (isMockPostsApi() ? { baseUrl: '' } : undefined)

export const canRequestProfilePosts = (userId: string) => {
  if (isMockPostsApi()) {
    return true
  }

  return /^[1-9]\d*$/.test(userId)
}

type GetProfilePostsParams = {
  userId: string
  cursor?: string | null
  pageSize?: number
}

const isStringValue = (value: unknown): value is string => typeof value === 'string'

const mapAuthorPostsPage = (page: SchemaGetAuthorPostsDto): PostsPage => ({
  items: page.items.map((post) => {
    const description = isStringValue(post.description) ? post.description : ''

    return {
      id: String(post.id),
      ownerId: String(post.authorId),
      ownerUsername: `User ${post.authorId}`,
      ownerAvatarUrl: null,
      images: post.images.map(({ url }) => ({ url, width: 0, height: 0 })),
      description,
      createdAt: post.createdAt,
      updatedAt: post.createdAt,
    }
  }),
  nextCursor: isStringValue(page.nextCursor) ? page.nextCursor : null,
})

const getProfilePostsPath = ({
  userId,
  cursor,
  pageSize = PROFILE_POSTS_PAGE_SIZE,
}: GetProfilePostsParams) => {
  if (isMockPostsApi()) {
    const searchParams = new URLSearchParams({ userId, pageSize: String(pageSize) })

    if (cursor) {
      searchParams.set('cursor', cursor)
    }

    return `${MOCK_POSTS_PATH}?${searchParams.toString()}`
  }

  const searchParams = new URLSearchParams({ limit: String(pageSize) })

  if (cursor) {
    searchParams.set('cursor', cursor)
  }

  return `${REAL_AUTHOR_POSTS_PATH}/${encodeURIComponent(userId)}/posts?${searchParams.toString()}`
}

export const getProfilePosts = async ({
  userId,
  cursor,
  pageSize = PROFILE_POSTS_PAGE_SIZE,
}: GetProfilePostsParams): Promise<PostsPage> => {
  if (!canRequestProfilePosts(userId)) {
    return { items: [], nextCursor: null }
  }

  const response = await api.get(
    getProfilePostsPath({ userId, cursor, pageSize }),
    getPostsRequestInit()
  )

  const postsPage = await response.json()

  return isMockPostsApi() ? postsPage : mapAuthorPostsPage(postsPage)
}

export const getPost = async (postId: string): Promise<Post> => {
  const response = await api.get(`${getPostsBasePath()}/${postId}`, getPostsRequestInit())

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
