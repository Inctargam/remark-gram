import type { Post, PostsPage } from '@/entities/post'
import { MOCK_CURRENT_USER_ID } from '@/shared/auth'

/**
 * In-memory posts store for the mock API.
 * Kept on `globalThis` so it survives dev-server hot reloads — otherwise every edit
 * would reset created/edited/deleted posts.
 */
const STORE_KEY = '__inctagramPostsMockStore'

type PostsStoreState = {
  posts: Post[]
}

type GlobalWithPostsStore = typeof globalThis & {
  [STORE_KEY]?: PostsStoreState
}

/** A second author, so the feed can prove it filters by owner. */
export const MOCK_OTHER_USER_ID = 'mock-user-2'

const DEFAULT_USERNAME = 'UserName'

/** `MOCK_CURRENT_USER_ID` owns the seeded feed: the app treats that id as the current user. */
const MOCK_USERNAMES: Record<string, string> = {
  [MOCK_CURRENT_USER_ID]: DEFAULT_USERNAME,
  [MOCK_OTHER_USER_ID]: 'OtherUser',
}

const getUsername = (ownerId: string) => MOCK_USERNAMES[ownerId] ?? DEFAULT_USERNAME

const SEED_POSTS_COUNT = 20
const SEED_OTHER_USER_POSTS_COUNT = 4
/** Fixed base date keeps seeded ordering (and its tests) deterministic. */
const SEED_BASE_TIME = Date.UTC(2026, 6, 1, 12, 0, 0)
const HOUR_IN_MS = 60 * 60 * 1000

const IMAGE_WIDTH = 1080
const IMAGE_HEIGHT = 1080

/**
 * Photos are not uploaded anywhere on mocks, so a seeded post carries a generated SVG
 * placeholder as a data URL. Real uploads arrive with the backend.
 */
const createSeedImageUrl = (label: string, hue: number) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}"><rect width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" fill="hsl(${hue}, 42%, 32%)"/><text x="50%" y="52%" fill="hsl(${hue}, 60%, 88%)" font-family="sans-serif" font-size="220" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const createSeedImages = (label: string, index: number): Post['images'] => {
  const imagesCount = index < 4 ? 5 : 1

  return Array.from({ length: imagesCount }, (_, imageIndex) => ({
    url: createSeedImageUrl(
      imagesCount > 1 ? `${label}.${imageIndex + 1}` : label,
      (index * 37 + imageIndex * 53) % 360
    ),
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  }))
}

const createSeedPost = (ownerId: string, index: number): Post => {
  const createdAt = new Date(SEED_BASE_TIME - index * HOUR_IN_MS).toISOString()
  const label = `${index + 1}`

  return {
    id: `${ownerId}-post-${label.padStart(2, '0')}`,
    ownerId,
    ownerUsername: getUsername(ownerId),
    ownerAvatarUrl: null,
    images: createSeedImages(label, index),
    description: `Mock publication ${label}. Seeded post used until the posts backend is ready.`,
    createdAt,
    updatedAt: createdAt,
  }
}

/** Newest first — the same order the real feed is expected to return. */
const createSeedPosts = (): Post[] => [
  ...Array.from({ length: SEED_POSTS_COUNT }, (_, index) =>
    createSeedPost(MOCK_CURRENT_USER_ID, index)
  ),
  ...Array.from({ length: SEED_OTHER_USER_POSTS_COUNT }, (_, index) =>
    createSeedPost(MOCK_OTHER_USER_ID, index)
  ),
]

const getState = (): PostsStoreState => {
  const globalWithStore = globalThis as GlobalWithPostsStore

  globalWithStore[STORE_KEY] ??= { posts: createSeedPosts() }

  return globalWithStore[STORE_KEY]
}

/** Test-only: brings the store back to its seeded state. */
export const resetPostsMockStore = () => {
  ;(globalThis as GlobalWithPostsStore)[STORE_KEY] = { posts: createSeedPosts() }
}

const getUserPosts = (userId: string) => getState().posts.filter((post) => post.ownerId === userId)

export const countUserPosts = (userId: string): number => getUserPosts(userId).length

export type ListPostsParams = {
  userId: string
  cursor?: string | null
  pageSize: number
}

/**
 * Cursor pagination: `cursor` is the id of the first post of the requested page,
 * `nextCursor` points at the first post of the following one (`null` on the last page).
 * Returns `null` when the cursor does not match any post of this user.
 */
export const listPosts = ({ userId, cursor, pageSize }: ListPostsParams): PostsPage | null => {
  const userPosts = getUserPosts(userId)
  const startIndex = cursor ? userPosts.findIndex((post) => post.id === cursor) : 0

  if (startIndex === -1) {
    return null
  }

  const endIndex = startIndex + pageSize

  return {
    items: userPosts.slice(startIndex, endIndex),
    nextCursor: userPosts[endIndex]?.id ?? null,
  }
}

export const findPost = (postId: string): Post | null =>
  getState().posts.find((post) => post.id === postId) ?? null

/** Edits only the description — every other field is owned by the server. */
export const updatePostDescription = (postId: string, description: string): Post | null => {
  const post = findPost(postId)

  if (!post) {
    return null
  }

  post.description = description
  post.updatedAt = new Date().toISOString()

  return post
}

export const deletePost = (postId: string): boolean => {
  const state = getState()
  const index = state.posts.findIndex((post) => post.id === postId)

  if (index === -1) {
    return false
  }

  state.posts.splice(index, 1)

  return true
}

export type CreatePostParams = {
  ownerId?: string
  description: string
  images: Post['images']
}

/** Returns the latest `count` posts globally, newest first. */
export const listLatestPosts = (count: number): Post[] => getState().posts.slice(0, count)

/** New posts go to the top of the feed, matching the newest-first ordering. */
export const createPost = ({
  ownerId = MOCK_CURRENT_USER_ID,
  description,
  images,
}: CreatePostParams): Post => {
  const createdAt = new Date().toISOString()
  const post: Post = {
    id: crypto.randomUUID(),
    ownerId,
    ownerUsername: getUsername(ownerId),
    ownerAvatarUrl: null,
    images,
    description,
    createdAt,
    updatedAt: createdAt,
  }

  getState().posts.unshift(post)

  return post
}
