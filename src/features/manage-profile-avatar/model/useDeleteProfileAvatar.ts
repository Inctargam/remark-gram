import { useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'

import { profileQueryKeys } from '@/entities/profile'

import { useDeleteProfileAvatarMutation } from '../api/useDeleteProfileAvatarMutation'
import { type AvatarChangeOperation, createAvatarChangeOperation } from './avatarUploadOperation'
import { getProfileAvatarErrorMessage } from './getProfileAvatarErrorMessage'

export const useDeleteProfileAvatar = () => {
  const deleteMutation = useDeleteProfileAvatarMutation()
  const queryClient = useQueryClient()
  const operationRef = useRef<AvatarChangeOperation | null>(null)
  const deletingRef = useRef(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const deleteAvatarClickHandler = () => {
    operationRef.current = createAvatarChangeOperation()
    setDeleteError(null)
    setIsDeleteModalOpen(true)
  }

  const deleteModalOpenChangeHandler = (open: boolean) => {
    if (deletingRef.current) {
      return
    }

    setIsDeleteModalOpen(open)

    if (!open) {
      if (operationRef.current?.reconciliationRequired) {
        void queryClient.invalidateQueries({ queryKey: profileQueryKeys.current() })
      }
      operationRef.current = null
      setDeleteError(null)
    }
  }

  const deleteAvatarConfirmHandler = async () => {
    if (deletingRef.current) {
      return
    }
    deletingRef.current = true
    setDeleteError(null)

    try {
      operationRef.current ??= createAvatarChangeOperation()
      await deleteMutation.mutateAsync(operationRef.current)
      operationRef.current = null
      setIsDeleteModalOpen(false)
    } catch (error) {
      setDeleteError(getProfileAvatarErrorMessage(error))
    } finally {
      deletingRef.current = false
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
