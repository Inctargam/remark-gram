/**
 * Post shapes are maintained by hand until the backend exposes posts in the OpenAPI schema.
 * When `pnpm api:generate` starts returning `posts` paths, replace these with `Schema*` types
 * from `src/shared/api/openapi/schema.d.ts` — see TODO(posts-schema) in `postsApi.ts`.
 */
export type PostImage = {
  url: string
  width: number
  height: number
}

export type Post = {
  id: string
  ownerId: string
  /** Author fields come denormalized from the API; the post view renders them without a second request. */
  ownerUsername: string
  ownerAvatarUrl: string | null
  images: PostImage[]
  description: string
  /** ISO 8601 */
  createdAt: string
  updatedAt: string
}

export type PostsPage = {
  items: Post[]
  /** Id of the first post of the next page, `null` on the last page. */
  nextCursor: string | null
}
