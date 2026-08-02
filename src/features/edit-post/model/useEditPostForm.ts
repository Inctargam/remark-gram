'use client'

import { useState } from 'react'

import { isValidPostDescription, normalizePostDescription } from '@/entities/post'

import { isPostDescriptionDirty } from './editPostDescription'

/**
 * State of the edit form. The only field is the description, so the dirty check is a pure
 * function over two strings — the closing scenarios of UC-2 branch on it, and it is unit-tested
 * on its own instead of through the modal.
 */
export const useEditPostForm = (initialDescription: string) => {
  const [description, setDescription] = useState(initialDescription)

  const isDirty = isPostDescriptionDirty(initialDescription, description)
  // A description longer than the limit can only come from stored data, not from typing:
  // the field itself caps the input.
  const canSave = isDirty && isValidPostDescription(description)

  const descriptionChangeHandler = (value: string) => {
    setDescription(normalizePostDescription(value))
  }

  return { canSave, description, descriptionChangeHandler, isDirty }
}
