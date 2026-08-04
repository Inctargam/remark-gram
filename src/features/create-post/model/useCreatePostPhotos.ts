import { useCallback, useEffect, useRef, useState } from 'react'

import {
  createImagePreview,
  type CreatePostPhotoPreviewSource,
  restoreImagePreview,
} from '../lib/createImagePreview'
import {
  type CreatePostAspectId,
  type CreatePostCropArea,
  type CreatePostImageSize,
  type CreatePostPoint,
  DEFAULT_CREATE_POST_CROP,
  DEFAULT_CREATE_POST_ZOOM,
} from './createPostCrop'
import type { CreatePostPhoto } from './createPostFile'
import type { CreatePostFilterId } from './createPostFilter'

const revokePhotoPreviewUrls = (photos: CreatePostPhoto[]) => {
  photos.forEach(({ previewUrl }) => {
    URL.revokeObjectURL(previewUrl)
  })
}

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
      revokePhotoPreviewUrls(photosRef.current)
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

  const selectFirstPhotoHandler = useCallback(() => {
    setSelectedPhotoId(photosRef.current[0]?.id ?? null)
  }, [])

  const removePhotoHandler = useCallback((photoId: string) => {
    setPhotos((currentPhotos) => {
      const removedPhotoIndex = currentPhotos.findIndex((photo) => photo.id === photoId)

      if (removedPhotoIndex === -1) {
        return currentPhotos
      }

      const removedPhoto = currentPhotos[removedPhotoIndex]
      const nextPhotos = currentPhotos.filter((photo) => photo.id !== photoId)

      URL.revokeObjectURL(removedPhoto.previewUrl)
      setSelectedPhotoId((currentSelectedPhotoId) => {
        if (currentSelectedPhotoId !== photoId) {
          return nextPhotos.some(({ id }) => id === currentSelectedPhotoId)
            ? currentSelectedPhotoId
            : (nextPhotos[0]?.id ?? null)
        }

        return nextPhotos[Math.min(removedPhotoIndex, nextPhotos.length - 1)]?.id ?? null
      })

      return nextPhotos
    })
  }, [])

  const resetPhotosHandler = useCallback(() => {
    revokePhotoPreviewUrls(photosRef.current)
    setPhotos([])
    setSelectedPhotoId(null)
  }, [])

  const restorePhotosHandler = useCallback(
    (draftPhotos: CreatePostPhotoPreviewSource[], draftSelectedPhotoId: string | null) => {
      const restoredPhotos = draftPhotos.map(restoreImagePreview)
      const hasDraftSelectedPhoto = restoredPhotos.some(({ id }) => id === draftSelectedPhotoId)

      revokePhotoPreviewUrls(photosRef.current)
      setPhotos(restoredPhotos)
      setSelectedPhotoId(
        hasDraftSelectedPhoto ? draftSelectedPhotoId : (restoredPhotos[0]?.id ?? null)
      )
    },
    []
  )

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
      updateSelectedPhotoHandler((photo) => ({
        ...photo,
        aspectId,
        crop: { ...DEFAULT_CREATE_POST_CROP },
        zoom: DEFAULT_CREATE_POST_ZOOM,
        croppedAreaPixels: null,
      }))
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

  const updateSelectedPhotoImageSizeHandler = useCallback(
    (imageSize: CreatePostImageSize) => {
      updateSelectedPhotoHandler((photo) => ({ ...photo, imageSize }))
    },
    [updateSelectedPhotoHandler]
  )

  return {
    photos,
    selectedPhoto,
    selectedPhotoId: effectiveSelectedPhotoId,
    addPhotosHandler,
    removePhotoHandler,
    resetPhotosHandler,
    restorePhotosHandler,
    selectFirstPhotoHandler,
    selectPhotoHandler,
    updateSelectedPhotoAspectHandler,
    updateSelectedPhotoCropHandler,
    updateSelectedPhotoCroppedAreaHandler,
    updateSelectedPhotoFilterHandler,
    updateSelectedPhotoImageSizeHandler,
    updateSelectedPhotoZoomHandler,
  }
}
