import type { Post } from '@/entities/post'

import { listLatestPosts } from './mock/postsStore'
import { getRegisteredUsersCount } from './mock/usersCountStore'

const HOME_PAGE_POSTS_COUNT = 4

export type HomePagePosts = {
  items: Post[]
}

export type HomePageUsersCount = {
  totalCount: number
}

export const getHomePagePosts = async (): Promise<HomePagePosts> => {
  const items = listLatestPosts(HOME_PAGE_POSTS_COUNT)

  return { items }
}

export const getHomePageUsersCount = async (): Promise<HomePageUsersCount> => {
  const totalCount = getRegisteredUsersCount()

  return { totalCount }
}
