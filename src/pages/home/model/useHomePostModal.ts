'use client'

import { useEffect, useState } from 'react'

import type { Post } from '@/entities/post'
import { ROUTES } from '@/shared/config'
import { buildPostModalCloseUrl, buildProfilePostUrl } from '@/widgets/profile-posts'

const EMPTY_SEARCH_PARAMS = new URLSearchParams()

type Params = {
  posts: Post[]
}

export const useHomePostModal = ({ posts }: Params) => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const selectedPost = posts.find((post) => post.id === selectedPostId) ?? null

  useEffect(() => {
    const popStateHandler = () => {
      const searchParams = new URLSearchParams(window.location.search)
      const postId = searchParams.get('postId')
      const hasMatchingPost = posts.some(
        (post) =>
          post.id === postId && window.location.pathname === ROUTES.profileById(post.ownerId)
      )

      setSelectedPostId(hasMatchingPost ? postId : null)
    }

    window.addEventListener('popstate', popStateHandler)

    return () => {
      window.removeEventListener('popstate', popStateHandler)
    }
  }, [posts])

  const postOpenHandler = (post: Post) => {
    setSelectedPostId(post.id)
    window.history.pushState(
      null,
      '',
      buildProfilePostUrl({
        userId: post.ownerId,
        postId: post.id,
        returnTo: ROUTES.home,
      })
    )
  }

  const modalOpenChangeHandler = (open: boolean) => {
    if (!open && selectedPost) {
      setSelectedPostId(null)
      window.history.replaceState(
        null,
        '',
        buildPostModalCloseUrl({
          searchParams:
            typeof window === 'undefined'
              ? EMPTY_SEARCH_PARAMS
              : new URLSearchParams(window.location.search),
          userId: selectedPost.ownerId,
        })
      )
    }
  }

  return {
    modalOpenChangeHandler,
    postOpenHandler,
    selectedPost,
  }
}
