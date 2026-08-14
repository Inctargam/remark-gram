'use client'

import type { Post } from '@/entities/post'
import { PostViewModal, useProfilePostsQuery } from '@/entities/post'
import { DeletePostDialog } from '@/features/delete-post'
import { EditPostModal } from '@/features/edit-post'
import { useSessionStatus } from '@/shared/auth'

import { useProfilePostModal } from '../model/useProfilePostModal'
import { ProfilePostOwnerActions } from './ProfilePostOwnerActions'
import { ProfilePostsGridView } from './ProfilePostsGridView'

type Props = {
  initialSelectedPost?: Post | null
  userId: string
}

const LOAD_ERROR_MESSAGE = 'Failed to load publications. Please try again.'

export const ProfilePostsGrid = ({ initialSelectedPost = null, userId }: Props) => {
  const sessionStatus = useSessionStatus()
  const { posts, error, hasNextPage, isFetchingNextPage, isPending, fetchNextPage } =
    useProfilePostsQuery(userId)
  const {
    deleteOpenChangeHandler,
    deleteStartHandler,
    editOpenChangeHandler,
    editStartHandler,
    isDeleting,
    isEditing,
    modalOpenChangeHandler,
    postDeletedHandler,
    postSelectHandler,
    selectedPost,
  } = useProfilePostModal({ initialSelectedPost, posts, userId })
  const canInteractWithPost = sessionStatus === 'authenticated'

  // Handlers are plain functions: React Compiler is on for this project (`reactCompiler`
  // in `next.config.ts`), so wrapping them in `useCallback` by hand would add nothing.
  const loadMoreHandler = () => {
    fetchNextPage()
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
        canInteract={canInteractWithPost}
        // The delete confirmation sits on top of the post, so a stray click must not
        // dismiss the post underneath it.
        disablePointerDismissal={isDeleting}
        actions={
          selectedPost ? (
            <ProfilePostOwnerActions
              post={selectedPost}
              onEdit={editStartHandler}
              onDelete={deleteStartHandler}
            />
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
