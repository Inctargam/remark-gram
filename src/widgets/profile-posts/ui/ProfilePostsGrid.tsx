'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import type { Post, PostsPage } from '@/entities/post'
import { PostViewModal, useProfilePostsQuery } from '@/entities/post'
import { DeletePostDialog } from '@/features/delete-post'
import { EditPostModal } from '@/features/edit-post'
import { PostActionsMenu } from '@/features/post-actions'
import { isProfileOwner } from '@/shared/auth'

import { buildPostModalCloseUrl, buildProfilePostUrl } from '../lib/profilePostUrl'
import { ProfilePostsGridView } from './ProfilePostsGridView'

type Props = {
  initialPage?: PostsPage
  initialSelectedPost?: Post | null
  userId: string
}

const LOAD_ERROR_MESSAGE = 'Failed to load publications. Please try again.'
const EMPTY_SEARCH_PARAMS = new URLSearchParams()

export const ProfilePostsGrid = ({ initialPage, initialSelectedPost = null, userId }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearchParams = searchParams ?? EMPTY_SEARCH_PARAMS
  const { posts, error, hasNextPage, isFetchingNextPage, isPending, fetchNextPage } =
    useProfilePostsQuery(userId, initialPage)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null)

  const selectedPostId = searchParams?.get('postId') ?? null
  const isEditing = selectedPostId !== null && editingPostId === selectedPostId
  const isDeleting = selectedPostId !== null && deletingPostId === selectedPostId
  // The open post is looked up in the feed by id instead of being copied into state:
  // an edited post re-renders with fresh data, and a deleted one closes the modal by itself.
  const selectedPost =
    posts.find(({ id }) => id === selectedPostId) ??
    (initialSelectedPost?.id === selectedPostId ? initialSelectedPost : null)
  // Editing and deleting belong to the post owner — the check follows the post, not the route.
  const canManageSelectedPost = selectedPost !== null && isProfileOwner(selectedPost.ownerId)

  // Handlers are plain functions: React Compiler is on for this project (`reactCompiler`
  // in `next.config.ts`), so wrapping them in `useCallback` by hand would add nothing.
  const loadMoreHandler = () => {
    fetchNextPage()
  }

  const postSelectHandler = (post: Post) => {
    setEditingPostId(null)
    setDeletingPostId(null)
    router.push(
      buildProfilePostUrl({ searchParams: currentSearchParams, userId, postId: post.id }),
      {
        scroll: false,
      }
    )
  }

  const modalOpenChangeHandler = (open: boolean) => {
    if (!open) {
      setEditingPostId(null)
      setDeletingPostId(null)
      router.replace(buildPostModalCloseUrl({ searchParams: currentSearchParams, userId }), {
        scroll: false,
      })
    }
  }

  const editStartHandler = () => {
    setEditingPostId(selectedPostId)
  }

  // Saving and discarding both land back on the post, so only the edit form closes here.
  const editOpenChangeHandler = (open: boolean) => {
    if (!open) {
      setEditingPostId(null)
    }
  }

  const deleteStartHandler = () => {
    setDeletingPostId(selectedPostId)
  }

  const deleteOpenChangeHandler = (open: boolean) => {
    if (!open) {
      setDeletingPostId(null)
    }
  }

  // After a deletion the user stays on the profile — the page behind the modal is already
  // their home page, so UC-3 needs the view closed, not a navigation.
  const postDeletedHandler = () => {
    setDeletingPostId(null)
    router.replace(buildPostModalCloseUrl({ searchParams: currentSearchParams, userId }), {
      scroll: false,
    })
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
