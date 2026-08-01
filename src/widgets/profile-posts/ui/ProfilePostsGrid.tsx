'use client'

import { useCallback, useState } from 'react'

import type { Post } from '@/entities/post'
import { PostViewModal, useProfilePostsQuery } from '@/entities/post'

import { ProfilePostsGridView } from './ProfilePostsGridView'

type Props = {
  userId: string
}

const LOAD_ERROR_MESSAGE = 'Failed to load publications. Please try again.'

export const ProfilePostsGrid = ({ userId }: Props) => {
  const { posts, error, hasNextPage, isFetchingNextPage, isPending, fetchNextPage } =
    useProfilePostsQuery(userId)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  // The open post is looked up in the feed by id instead of being copied into state:
  // an edited post re-renders with fresh data, and a deleted one closes the modal by itself.
  const selectedPost = posts.find(({ id }) => id === selectedPostId) ?? null

  const loadMoreHandler = useCallback(() => {
    fetchNextPage()
  }, [fetchNextPage])

  const postSelectHandler = useCallback((post: Post) => {
    setSelectedPostId(post.id)
  }, [])

  const modalOpenChangeHandler = useCallback((open: boolean) => {
    if (!open) {
      setSelectedPostId(null)
    }
  }, [])

  return (
    <>
      <ProfilePostsGridView
        posts={posts}
        errorMessage={error ? LOAD_ERROR_MESSAGE : null}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isPending}
        onLoadMore={loadMoreHandler}
        onPostSelect={postSelectHandler}
      />

      {/* TODO(uc-2/uc-3): pass the three-dot menu into `actions` for the post owner. */}
      <PostViewModal
        post={selectedPost}
        open={selectedPost !== null}
        onOpenChange={modalOpenChangeHandler}
      />
    </>
  )
}
