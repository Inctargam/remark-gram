'use client'

import { useState } from 'react'

import type { Post } from '@/entities/post'
import { PostViewModal, useProfilePostsQuery } from '@/entities/post'
import { DeletePostDialog } from '@/features/delete-post'
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
  const [isDeleting, setIsDeleting] = useState(false)

  // The open post is looked up in the feed by id instead of being copied into state:
  // an edited post re-renders with fresh data, and a deleted one closes the modal by itself.
  const selectedPost = posts.find(({ id }) => id === selectedPostId) ?? null
  // Editing and deleting belong to the post owner — the check follows the post, not the route.
  const canManageSelectedPost = selectedPost !== null && isProfileOwner(selectedPost.ownerId)

  // Handlers are plain functions: React Compiler is on for this project (`reactCompiler`
  // in `next.config.ts`), so wrapping them in `useCallback` by hand would add nothing.
  const loadMoreHandler = () => {
    fetchNextPage()
  }

  const postSelectHandler = (post: Post) => {
    setSelectedPostId(post.id)
  }

  const modalOpenChangeHandler = (open: boolean) => {
    if (!open) {
      setSelectedPostId(null)
    }
  }

  const editStartHandler = () => {
    setIsEditing(true)
  }

  // Saving and discarding both land back on the post, so only the edit form closes here.
  const editOpenChangeHandler = (open: boolean) => {
    if (!open) {
      setIsEditing(false)
    }
  }

  const deleteStartHandler = () => {
    setIsDeleting(true)
  }

  const deleteOpenChangeHandler = (open: boolean) => {
    if (!open) {
      setIsDeleting(false)
    }
  }

  // After a deletion the user stays on the profile — the page behind the modal is already
  // their home page, so UC-3 needs the view closed, not a navigation.
  const postDeletedHandler = () => {
    setSelectedPostId(null)
  }

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
        // The delete confirmation sits on top of the post, so a stray click must not
        // dismiss the post underneath it.
        disablePointerDismissal={isDeleting}
        actions={
          canManageSelectedPost ? (
            <PostActionsMenu onEdit={editStartHandler} onDelete={deleteStartHandler} />
          ) : undefined
        }
      />

      {selectedPost && isEditing ? (
        <EditPostModal post={selectedPost} open onOpenChange={editOpenChangeHandler} />
      ) : null}

      {selectedPost && isDeleting ? (
        <DeletePostDialog
          post={selectedPost}
          open
          onOpenChange={deleteOpenChangeHandler}
          onDeleted={postDeletedHandler}
        />
      ) : null}
    </>
  )
}
