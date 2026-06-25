import { useCallback, useEffect, useRef, useState } from 'react'

import { createImagePreview } from '../lib/createImagePreview'
import type { CreatePostAspectId, CreatePostCropArea, CreatePostPoint } from './createPostCrop'
import type { CreatePostPhoto } from './createPostFile'
import type { CreatePostFilterId } from './createPostFilter'

export const useCreatePostPhotos = () => {
  const [photos, setPhotos] = useState<CreatePostPhoto[]>([])
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null)
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

  const addPhotosHandler = useCallback((files: File[]) => {
    setPhotos((currentPhotos) => {
      const nextPhotos = [...currentPhotos, ...files.map(createImagePreview)]

      setSelectedPhotoId((currentSelectedPhotoId) => currentSelectedPhotoId ?? nextPhotos[0].id)

      return nextPhotos
    })
  }, [])

  const selectPhotoHandler = useCallback((photoId: string) => {
    setSelectedPhotoId(photoId)
  }, [])

  const updateSelectedPhotoHandler = useCallback(
    (updatePhoto: (photo: CreatePostPhoto) => CreatePostPhoto) => {
      if (!selectedPhoto) {
        return
      }

      setPhotos((currentPhotos) =>
        currentPhotos.map((photo) => (photo.id === selectedPhoto.id ? updatePhoto(photo) : photo))
      )
    },
    [selectedPhoto]
  )

  const updateSelectedPhotoCropHandler = useCallback(
    (crop: CreatePostPoint) => {
      updateSelectedPhotoHandler((photo) => ({ ...photo, crop }))
    },
    [updateSelectedPhotoHandler]
  )

  const updateSelectedPhotoZoomHandler = useCallback(
    (zoom: number) => {
      updateSelectedPhotoHandler((photo) => ({ ...photo, zoom }))
    },
    [updateSelectedPhotoHandler]
  )

  const updateSelectedPhotoAspectHandler = useCallback(
    (aspectId: CreatePostAspectId) => {
      updateSelectedPhotoHandler((photo) => ({ ...photo, aspectId, croppedAreaPixels: null }))
    },
    [updateSelectedPhotoHandler]
  )

  const updateSelectedPhotoCroppedAreaHandler = useCallback(
    (croppedAreaPixels: CreatePostCropArea) => {
      updateSelectedPhotoHandler((photo) => ({ ...photo, croppedAreaPixels }))
    },
    [updateSelectedPhotoHandler]
  )

  const updateSelectedPhotoFilterHandler = useCallback(
    (filterId: CreatePostFilterId) => {
      updateSelectedPhotoHandler((photo) => ({ ...photo, filterId }))
    },
    [updateSelectedPhotoHandler]
  )

  return {
    photos,
    selectedPhoto,
    selectedPhotoId: effectiveSelectedPhotoId,
    addPhotosHandler,
    selectPhotoHandler,
    updateSelectedPhotoAspectHandler,
    updateSelectedPhotoCropHandler,
    updateSelectedPhotoCroppedAreaHandler,
    updateSelectedPhotoFilterHandler,
    updateSelectedPhotoZoomHandler,
  }
}
