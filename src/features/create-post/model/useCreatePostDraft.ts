import { useState } from 'react'

import {
  clearCreatePostDraft,
  type CreatePostDraft,
  getCreatePostDraft,
  saveCreatePostDraft,
} from './createPostDraft'

export const useCreatePostDraft = () => {
  const [hasDraft, setHasDraft] = useState(() => Boolean(getCreatePostDraft()))

  const saveDraftHandler = (draft: CreatePostDraft) => {
    saveCreatePostDraft(draft)
    setHasDraft(true)
  }

  const getDraftHandler = () => getCreatePostDraft()

  const clearDraftHandler = () => {
    clearCreatePostDraft()
    setHasDraft(false)
  }

  return {
    hasDraft,
    clearDraftHandler,
    getDraftHandler,
    saveDraftHandler,
  }
}
