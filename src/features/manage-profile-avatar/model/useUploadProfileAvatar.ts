import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import type { Area, Point } from 'react-easy-crop'

import { profileQueryKeys } from '@/entities/profile'

import { useUploadProfileAvatarMutation } from '../api/useUploadProfileAvatarMutation'
import { exportCroppedProfileAvatar } from '../lib/exportCroppedProfileAvatar'
import { type AvatarUploadOperation, createAvatarUploadOperation } from './avatarUploadOperation'
import { getProfileAvatarErrorMessage } from './getProfileAvatarErrorMessage'
import { DEFAULT_PROFILE_AVATAR_CROP, DEFAULT_PROFILE_AVATAR_ZOOM } from './profileAvatarCrop'
import { PROFILE_AVATAR_FILE_ERROR, validateProfileAvatar } from './profileAvatarFile'

export const useUploadProfileAvatar = () => {
  const uploadMutation = useUploadProfileAvatarMutation()
  const queryClient = useQueryClient()
  const operationRef = useRef<AvatarUploadOperation | null>(null)
  const savingRef = useRef(false)
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
    operationRef.current = null
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
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setCrop(DEFAULT_PROFILE_AVATAR_CROP)
    setZoom(DEFAULT_PROFILE_AVATAR_ZOOM)
    setCroppedAreaPixels(null)
  }

  const cropCompleteHandler = (_croppedArea: Area, nextCroppedAreaPixels: Area) => {
    if (savingRef.current) {
      return
    }
    const cropChanged =
      !croppedAreaPixels ||
      (['x', 'y', 'width', 'height'] as const).some(
        (dimension) => croppedAreaPixels[dimension] !== nextCroppedAreaPixels[dimension]
      )
    if (cropChanged) {
      operationRef.current = null
    }
    setCroppedAreaPixels(nextCroppedAreaPixels)
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
    if (!savingRef.current && (nextCrop.x !== crop.x || nextCrop.y !== crop.y)) {
      operationRef.current = null
      setCroppedAreaPixels(null)
      setCrop(nextCrop)
    }
  }

  const zoomChangeHandler = (nextZoom: number) => {
    if (!savingRef.current && nextZoom !== zoom) {
      operationRef.current = null
      setCroppedAreaPixels(null)
      setZoom(nextZoom)
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
