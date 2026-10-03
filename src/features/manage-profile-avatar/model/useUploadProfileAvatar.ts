import { useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import type { Area, Point } from 'react-easy-crop'

import { profileQueryKeys } from '@/entities/profile'

import { useUploadProfileAvatarMutation } from '../api/useUploadProfileAvatarMutation'
import { exportCroppedProfileAvatar } from '../lib/exportCroppedProfileAvatar'
import { type AvatarUploadOperation, createAvatarUploadOperation } from './avatarUploadOperation'
import { getProfileAvatarErrorMessage } from './getProfileAvatarErrorMessage'
import { PROFILE_AVATAR_FILE_ERROR, validateProfileAvatar } from './profileAvatarFile'
import { useProfileAvatarEditor } from './useProfileAvatarEditor'

export const useUploadProfileAvatar = () => {
  const uploadMutation = useUploadProfileAvatarMutation()
  const queryClient = useQueryClient()
  const editor = useProfileAvatarEditor()
  const { selectedFile, croppedAreaPixels, crop, zoom, previewUrl } = editor
  const operationRef = useRef<AvatarUploadOperation | null>(null)
  const savingRef = useRef(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const resetSelection = () => {
    operationRef.current = null
    editor.resetEditor()
    setUploadError(null)
  }

  const addAvatarClickHandler = () => {
    setUploadError(null)
    setIsAddModalOpen(true)
  }

  const addModalOpenChangeHandler = (open: boolean) => {
    if (savingRef.current) {
      return
    }

    setIsAddModalOpen(open)

    if (!open) {
      if (operationRef.current?.reconciliationRequired) {
        void queryClient.invalidateQueries({ queryKey: profileQueryKeys.current() })
      }
      resetSelection()
    }
  }

  const fileSelectHandler = (file: File | undefined) => {
    if (savingRef.current) {
      return
    }
    if (!file || !validateProfileAvatar(file)) {
      resetSelection()
      setUploadError(PROFILE_AVATAR_FILE_ERROR)
      return
    }

    setUploadError(null)
    operationRef.current = null
    editor.selectFile(file)
  }

  const cropCompleteHandler = (_croppedArea: Area, nextCroppedAreaPixels: Area) => {
    if (savingRef.current) {
      return
    }
    if (editor.cropCompleteHandler(nextCroppedAreaPixels)) {
      operationRef.current = null
    }
  }

  const saveAvatarHandler = async () => {
    if (!selectedFile || !croppedAreaPixels || savingRef.current) {
      return
    }

    setUploadError(null)
    savingRef.current = true
    setIsSaving(true)

    try {
      if (!operationRef.current) {
        const croppedFile = await exportCroppedProfileAvatar(selectedFile, croppedAreaPixels)
        if (!validateProfileAvatar(croppedFile)) {
          throw new Error(PROFILE_AVATAR_FILE_ERROR)
        }
        operationRef.current = createAvatarUploadOperation(croppedFile)
      }

      await uploadMutation.mutateAsync(operationRef.current)
      setIsAddModalOpen(false)
      resetSelection()
    } catch (error) {
      setUploadError(getProfileAvatarErrorMessage(error))
    } finally {
      savingRef.current = false
      setIsSaving(false)
    }
  }

  const cropChangeHandler = (nextCrop: Point) => {
    if (savingRef.current) {
      return
    }
    if (editor.cropChangeHandler(nextCrop)) {
      operationRef.current = null
    }
  }

  const zoomChangeHandler = (nextZoom: number) => {
    if (savingRef.current) {
      return
    }
    if (editor.zoomChangeHandler(nextZoom)) {
      operationRef.current = null
    }
  }

  return {
    crop,
    isAddModalOpen,
    isSaving,
    isSaveDisabled: isSaving || !croppedAreaPixels,
    previewUrl,
    uploadError,
    zoom,
    addModalOpenChangeHandler,
    addAvatarClickHandler,
    cropCompleteHandler,
    fileSelectHandler,
    saveAvatarHandler,
    setCrop: cropChangeHandler,
    setZoom: zoomChangeHandler,
  }
}
