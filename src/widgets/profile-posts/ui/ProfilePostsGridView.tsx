'use client'

import type { Post } from '@/entities/post'
import { PostThumbnail, PROFILE_POSTS_PAGE_SIZE } from '@/entities/post'
import { Button } from '@/shared/ui/button'

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

  // With nothing on screen the error is the whole state; with posts already loaded it is
  // only the failed next page, so the feed must stay and the message goes under it.
  if (isEmpty) {
    return errorMessage ? (
      <p className={styles.message} role="alert">
        {errorMessage}
      </p>
    ) : (
      <p className={styles.message}>No publications yet.</p>
    )
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

      {errorMessage ? (
        <div className={styles.loadMoreError}>
          <p className={styles.message} role="alert">
            {errorMessage}
          </p>
          <Button type="button" variant="outline" onClick={onLoadMore}>
            Try again
          </Button>
        </div>
      ) : null}

      {/* Sentinel stays mounted only while there is something left to load. It is dropped on
          an error: a visible sentinel would retry the failed page in a loop. */}
      {hasNextPage && !errorMessage ? (
        <div className={styles.sentinel} ref={sentinelRef} aria-hidden="true" />
      ) : null}
    </>
  )
}
