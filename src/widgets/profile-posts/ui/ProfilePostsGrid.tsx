'use client'

import { useCallback, useState } from 'react'

import type { Post } from '@/entities/post'
import { PostViewModal, useProfilePostsQuery } from '@/entities/post'
import { EditPostModal } from '@/features/edit-post'
import { PostActionsMenu } from '@/features/post-actions'
import { isProfileOwner } from '@/shared/auth'

import { ProfilePostsGridView } from './ProfilePostsGridView'

type Props = {
  userId: string
}

const LOAD_ERROR_MESSAGE = 'Failed to load publications. Please try again.'

export const ProfilePostsGrid = ({ userId }: Props) => {
  const { posts, error, hasNextPage, isFetchingNextPage, isPending, fetchNextPage } =
    useProfilePostsQuery(userId)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // The open post is looked up in the feed by id instead of being copied into state:
  // an edited post re-renders with fresh data, and a deleted one closes the modal by itself.
  const selectedPost = posts.find(({ id }) => id === selectedPostId) ?? null
  // Editing and deleting belong to the post owner — the check follows the post, not the route.
  const canManageSelectedPost = selectedPost !== null && isProfileOwner(selectedPost.ownerId)

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

  const editStartHandler = useCallback(() => {
    setIsEditing(true)
  }, [])

  // Saving and discarding both land back on the post, so only the edit form closes here.
  const editOpenChangeHandler = useCallback((open: boolean) => {
    if (!open) {
      setIsEditing(false)
    }
  }, [])

  const deleteStartHandler = useCallback(() => {
    // TODO(uc-3): open the delete confirmation.
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

      <PostViewModal
        post={selectedPost}
        // The view steps aside while the edit form is open: both take the same box on screen.
        open={selectedPost !== null && !isEditing}
        onOpenChange={modalOpenChangeHandler}
        actions={
          canManageSelectedPost ? (
            <PostActionsMenu onEdit={editStartHandler} onDelete={deleteStartHandler} />
          ) : undefined
        }
      />

      {selectedPost && isEditing ? (
        <EditPostModal post={selectedPost} open onOpenChange={editOpenChangeHandler} />
      ) : null}
    </>
  )
}
