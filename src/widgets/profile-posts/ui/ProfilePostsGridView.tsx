'use client'

import type { Post } from '@/entities/post'
import { PostThumbnail, PROFILE_POSTS_PAGE_SIZE } from '@/entities/post'

import { useInfiniteScroll } from '../lib/useInfiniteScroll'
import styles from './profilePostsGrid.module.css'

type Props = {
  posts: Post[]
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  errorMessage?: string | null
  onLoadMore: () => void
  onPostSelect: (post: Post) => void
}

const SKELETON_KEYS = Array.from({ length: PROFILE_POSTS_PAGE_SIZE }, (_, index) => index)

const PostsSkeleton = () => (
  <>
    {SKELETON_KEYS.map((key) => (
      <div className={styles.skeleton} key={key} aria-hidden="true" />
    ))}
  </>
)

/**
 * Presentational half of the profile feed: no queries, so stories and story tests
 * can drive every state (first load, empty, error, loading more) through props.
 */
export const ProfilePostsGridView = ({
  posts,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  errorMessage = null,
  onLoadMore,
  onPostSelect,
}: Props) => {
  const sentinelRef = useInfiniteScroll({ hasNextPage, isFetchingNextPage, onLoadMore })
  const isEmpty = posts.length === 0

  if (isLoading) {
    return (
      <div className={styles.grid} aria-busy="true" aria-label="Profile publications">
        <PostsSkeleton />
      </div>
    )
  }

  if (errorMessage) {
    return (
      <p className={styles.message} role="alert">
        {errorMessage}
      </p>
    )
  }

  if (isEmpty) {
    return <p className={styles.message}>No publications yet.</p>
  }

  return (
    <>
      <div className={styles.grid} aria-label="Profile publications">
        {posts.map((post) => (
          // The tile is a button, not a link: the post opens in a modal and keeps the URL.
          // Its accessible name comes from the image alt inside the thumbnail.
          <button
            className={styles.thumbnailButton}
            type="button"
            key={post.id}
            onClick={() => onPostSelect(post)}>
            <PostThumbnail post={post} />
          </button>
        ))}
        {isFetchingNextPage ? <PostsSkeleton /> : null}
      </div>
      {/* Sentinel stays mounted only while there is something left to load. */}
      {hasNextPage ? (
        <div className={styles.sentinel} ref={sentinelRef} aria-hidden="true" />
      ) : null}
    </>
  )
}
