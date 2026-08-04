import { useCallback, useState } from 'react'

import {
  clearCreatePostDraft,
  type CreatePostDraft,
  getCreatePostDraft,
  saveCreatePostDraft,
} from './createPostDraft'

export const useCreatePostDraft = () => {
  const [hasDraft, setHasDraft] = useState(() => Boolean(getCreatePostDraft()))

  const saveDraftHandler = useCallback((draft: CreatePostDraft) => {
    saveCreatePostDraft(draft)
    setHasDraft(true)
  }, [])

  const getDraftHandler = useCallback(() => getCreatePostDraft(), [])

  const clearDraftHandler = useCallback(() => {
    clearCreatePostDraft()
    setHasDraft(false)
  }, [])

  return {
    hasDraft,
    clearDraftHandler,
    getDraftHandler,
    saveDraftHandler,
  }
}
