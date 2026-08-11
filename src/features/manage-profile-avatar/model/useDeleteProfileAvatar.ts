import { useState } from 'react'

import { useDeleteProfileAvatarMutation } from '../api/useDeleteProfileAvatarMutation'
import { getProfileAvatarErrorMessage } from './getProfileAvatarErrorMessage'

export const useDeleteProfileAvatar = () => {
  const deleteMutation = useDeleteProfileAvatarMutation()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const deleteAvatarClickHandler = () => {
    setDeleteError(null)
    setIsDeleteModalOpen(true)
  }

  const deleteModalOpenChangeHandler = (open: boolean) => {
    if (deleteMutation.isPending) {
      return
    }

    setIsDeleteModalOpen(open)

    if (!open) {
      setDeleteError(null)
    }
  }

  const deleteAvatarConfirmHandler = async () => {
    setDeleteError(null)

    try {
      await deleteMutation.mutateAsync()
      setIsDeleteModalOpen(false)
    } catch (error) {
      setDeleteError(getProfileAvatarErrorMessage(error))
    }
  }

  return {
    deleteError,
    isDeleteModalOpen,
    isDeleting: deleteMutation.isPending,
    deleteModalOpenChangeHandler,
    deleteAvatarClickHandler,
    deleteAvatarConfirmHandler,
  }
}
