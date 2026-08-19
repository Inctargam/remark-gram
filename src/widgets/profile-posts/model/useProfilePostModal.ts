'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import type { Post } from '@/entities/post'

import { buildPostModalCloseUrl, buildProfilePostUrl } from '../lib/profilePostUrl'

type Params = {
  initialSelectedPost?: Post | null
  posts: Post[]
  userId: string
}

const EMPTY_SEARCH_PARAMS = new URLSearchParams()

export const useProfilePostModal = ({ initialSelectedPost = null, posts, userId }: Params) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearchParams = searchParams ?? EMPTY_SEARCH_PARAMS
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null)

  const selectedPostId = searchParams
    ? (searchParams.get('postId') ?? null)
    : (initialSelectedPost?.id ?? null)
  const isEditing = selectedPostId !== null && editingPostId === selectedPostId
  const isDeleting = selectedPostId !== null && deletingPostId === selectedPostId
  const selectedPost =
    posts.find(({ id }) => id === selectedPostId) ??
    (initialSelectedPost?.id === selectedPostId ? initialSelectedPost : null)

  const closePostRoute = () => {
    router.replace(buildPostModalCloseUrl({ searchParams: currentSearchParams, userId }), {
      scroll: false,
    })
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
      closePostRoute()
    }
  }

  const editStartHandler = () => {
    setEditingPostId(selectedPostId)
  }

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

  const postDeletedHandler = () => {
    setDeletingPostId(null)
    closePostRoute()
  }

  return {
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
  }
}
