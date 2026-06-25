import { useCallback, useEffect, useRef, useState } from 'react'

import { createImagePreview } from '../lib/createImagePreview'
import type { CreatePostAspectId, CreatePostCropArea, CreatePostPoint } from './createPostCrop'
import type { CreatePostPhoto } from './createPostFile'
import { validateCreatePostFiles } from './createPostFile'

type CreatePostStep = 'add-photo' | 'crop'

export const useCreatePostFlow = () => {
  const [step, setStep] = useState<CreatePostStep>('add-photo')
  const [photos, setPhotos] = useState<CreatePostPhoto[]>([])
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const photosRef = useRef<CreatePostPhoto[]>([])

  const selectedPhoto = photos.find(({ id }) => id === selectedPhotoId) ?? photos[0] ?? null
  const effectiveSelectedPhotoId = selectedPhoto?.id ?? null

  useEffect(() => {
    photosRef.current = photos
  }, [photos])

  useEffect(
    () => () => {
      photosRef.current.forEach(({ previewUrl }) => {
        URL.revokeObjectURL(previewUrl)
      })
    },
    []
  )

  const selectPhotosHandler = useCallback(
    (files: File[]) => {
      const validation = validateCreatePostFiles(files, photos.length)

      if (!validation.isValid) {
        setUploadError(validation.error)
        return
      }

      if (files.length === 0) {
        return
      }

      setUploadError(null)
      setPhotos((currentPhotos) => {
        const nextPhotos = [...currentPhotos, ...files.map(createImagePreview)]

        setSelectedPhotoId((currentSelectedPhotoId) => currentSelectedPhotoId ?? nextPhotos[0].id)

        return nextPhotos
      })
      setStep('crop')
    },
    [photos.length]
  )

  const updateSelectedPhotoHandler = useCallback((photoId: string) => {
    setSelectedPhotoId(photoId)
  }, [])

  const updateSelectedPhotoCropHandler = useCallback(
    (crop: CreatePostPoint) => {
      if (!selectedPhoto) {
        return
      }

      setPhotos((currentPhotos) =>
        currentPhotos.map((photo) => (photo.id === selectedPhoto.id ? { ...photo, crop } : photo))
      )
    },
    [selectedPhoto]
  )

  const updateSelectedPhotoZoomHandler = useCallback(
    (zoom: number) => {
      if (!selectedPhoto) {
        return
      }

      setPhotos((currentPhotos) =>
        currentPhotos.map((photo) => (photo.id === selectedPhoto.id ? { ...photo, zoom } : photo))
      )
    },
    [selectedPhoto]
  )

  const updateSelectedPhotoAspectHandler = useCallback(
    (aspectId: CreatePostAspectId) => {
      if (!selectedPhoto) {
        return
      }

      setPhotos((currentPhotos) =>
        currentPhotos.map((photo) =>
          photo.id === selectedPhoto.id ? { ...photo, aspectId, croppedAreaPixels: null } : photo
        )
      )
    },
    [selectedPhoto]
  )

  const updateSelectedPhotoCroppedAreaHandler = useCallback(
    (croppedAreaPixels: CreatePostCropArea) => {
      if (!selectedPhoto) {
        return
      }

      setPhotos((currentPhotos) =>
        currentPhotos.map((photo) =>
          photo.id === selectedPhoto.id ? { ...photo, croppedAreaPixels } : photo
        )
      )
    },
    [selectedPhoto]
  )

  return {
    selectedPhoto,
    selectedPhotoId: effectiveSelectedPhotoId,
    step,
    photos,
    uploadError,
    selectPhotosHandler,
    updateSelectedPhotoAspectHandler,
    updateSelectedPhotoCropHandler,
    updateSelectedPhotoCroppedAreaHandler,
    updateSelectedPhotoHandler,
    updateSelectedPhotoZoomHandler,
  }
}
