import { useEffect, useState } from 'react'
import type { Area, Point } from 'react-easy-crop'

import { useUploadProfileAvatarMutation } from '../api/useUploadProfileAvatarMutation'
import { exportCroppedProfileAvatar } from '../lib/exportCroppedProfileAvatar'
import { getProfileAvatarErrorMessage } from './getProfileAvatarErrorMessage'
import { DEFAULT_PROFILE_AVATAR_CROP, DEFAULT_PROFILE_AVATAR_ZOOM } from './profileAvatarCrop'
import { PROFILE_AVATAR_FILE_ERROR, validateProfileAvatar } from './profileAvatarFile'

export const useUploadProfileAvatar = () => {
  const uploadMutation = useUploadProfileAvatarMutation()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [crop, setCrop] = useState<Point>(DEFAULT_PROFILE_AVATAR_CROP)
  const [zoom, setZoom] = useState(DEFAULT_PROFILE_AVATAR_ZOOM)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const resetSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setCrop(DEFAULT_PROFILE_AVATAR_CROP)
    setZoom(DEFAULT_PROFILE_AVATAR_ZOOM)
    setCroppedAreaPixels(null)
    setUploadError(null)
  }

  const addAvatarClickHandler = () => {
    setUploadError(null)
    setIsAddModalOpen(true)
  }

  const addModalOpenChangeHandler = (open: boolean) => {
    if (isSaving) {
      return
    }

    setIsAddModalOpen(open)

    if (!open) {
      resetSelection()
    }
  }

  const fileSelectHandler = (file: File | undefined) => {
    if (!file || !validateProfileAvatar(file)) {
      resetSelection()
      setUploadError(PROFILE_AVATAR_FILE_ERROR)
      return
    }

    setUploadError(null)
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setCrop(DEFAULT_PROFILE_AVATAR_CROP)
    setZoom(DEFAULT_PROFILE_AVATAR_ZOOM)
    setCroppedAreaPixels(null)
  }

  const cropCompleteHandler = (_croppedArea: Area, nextCroppedAreaPixels: Area) => {
    setCroppedAreaPixels(nextCroppedAreaPixels)
  }

  const saveAvatarHandler = async () => {
    if (!selectedFile || !croppedAreaPixels || isSaving) {
      return
    }

    setUploadError(null)
    setIsSaving(true)

    try {
      const croppedFile = await exportCroppedProfileAvatar(selectedFile, croppedAreaPixels)

      await uploadMutation.mutateAsync(croppedFile)
      setIsAddModalOpen(false)
      resetSelection()
    } catch (error) {
      setUploadError(getProfileAvatarErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  return {
    crop,
    isAddModalOpen,
    isSaving,
    previewUrl,
    uploadError,
    zoom,
    addModalOpenChangeHandler,
    addAvatarClickHandler,
    cropCompleteHandler,
    fileSelectHandler,
    saveAvatarHandler,
    setCrop,
    setZoom,
  }
}
