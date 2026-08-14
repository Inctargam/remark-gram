import type { PostsPage } from '../model/types'

export const PROFILE_POSTS_INITIAL_PAGE_PARAM: string | null = null
export const PROFILE_POSTS_STALE_TIME_MS = 30_000

export const getProfilePostsNextPageParam = ({ nextCursor }: PostsPage) => nextCursor
