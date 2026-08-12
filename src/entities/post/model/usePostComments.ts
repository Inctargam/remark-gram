'use client'

import { useState } from 'react'

import {
  createMockPostComments,
  createPublishedPostComment,
  getPublishablePostComment,
  normalizePostComment,
} from './postComments'

export const usePostComments = (postId: string) => {
  const [comments, setComments] = useState(() => createMockPostComments(postId))
  const [draftComment, setDraftComment] = useState('')

  const commentChangeHandler = (comment: string) => {
    setDraftComment(normalizePostComment(comment))
  }

  const commentPublishHandler = () => {
    const text = getPublishablePostComment(draftComment)

    if (!text) {
      return
    }

    const publishedComment = createPublishedPostComment({
      id: `${postId}-comment-${Date.now()}`,
      text,
    })

    setComments((currentComments) => [...currentComments, publishedComment])
    setDraftComment('')
  }

  return {
    comments,
    draftComment,
    canPublishComment: getPublishablePostComment(draftComment) !== null,
    commentChangeHandler,
    commentPublishHandler,
  }
}
