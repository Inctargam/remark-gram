'use client'

import { useState } from 'react'

export const usePostAnswers = () => {
  const [expandedCommentIds, setExpandedCommentIds] = useState<Set<string>>(() => new Set())

  const answerToggleHandler = (commentId: string) => {
    setExpandedCommentIds((currentIds) => {
      const nextIds = new Set(currentIds)

      if (nextIds.has(commentId)) {
        nextIds.delete(commentId)
      } else {
        nextIds.add(commentId)
      }

      return nextIds
    })
  }

  return {
    expandedCommentIds,
    answerToggleHandler,
  }
}
