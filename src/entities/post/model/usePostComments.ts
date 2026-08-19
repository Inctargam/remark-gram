'use client'

import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { getPostComments, publishPostComment } from '../api/postCommentsApi'
import { getPublishablePostComment, normalizePostComment } from './postComments'

export const usePostComments = (postId: string) => {
  const [comments, setComments] = useState(() => getPostComments(postId))
  const [draftComment, setDraftComment] = useState('')
  const publishCommentMutation = useMutation({
    mutationFn: publishPostComment,
    onSuccess: () => {
      setComments(getPostComments(postId))
      setDraftComment('')
    },
  })

  const commentChangeHandler = (comment: string) => {
    setDraftComment(normalizePostComment(comment))
  }

  const commentPublishHandler = () => {
    const text = getPublishablePostComment(draftComment)

    if (!text || publishCommentMutation.isPending) {
      return
    }

    publishCommentMutation.mutate({ postId, text })
  }

  return {
    comments,
    draftComment,
    canPublishComment:
      getPublishablePostComment(draftComment) !== null && !publishCommentMutation.isPending,
    isPublishingComment: publishCommentMutation.isPending,
    commentChangeHandler,
    commentPublishHandler,
  }
}
