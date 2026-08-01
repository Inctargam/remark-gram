import type { Post, PostsPage } from '../model/types'

/**
 * Joins infinite-query pages into a single list.
 * Deduplicates by id on purpose: the cursor window shifts when a post is created or deleted
 * between two page requests, so the same post can arrive on two pages.
 */
export const flattenPostsPages = (pages: PostsPage[] | undefined): Post[] => {
  if (!pages) {
    return []
  }

  const seenIds = new Set<string>()

  return pages.flatMap(({ items }) =>
    items.filter((post) => {
      if (seenIds.has(post.id)) {
        return false
      }

      seenIds.add(post.id)

      return true
    })
  )
}
