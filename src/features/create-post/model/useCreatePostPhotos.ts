import { useEffect, useRef, useState } from 'react'

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

  const commitPhotosHandler = (nextPhotos: CreatePostPhoto[]) => {
    photosRef.current = nextPhotos
    setPhotos(nextPhotos)
  }

  const addPhotosHandler = (files: File[]) => {
    const addedPhotos = files.map(createImagePreview)
    const nextPhotos = [...photosRef.current, ...addedPhotos]
    const fallbackSelectedPhotoId = photosRef.current[0]?.id ?? addedPhotos[0]?.id ?? null

    commitPhotosHandler(nextPhotos)
    setSelectedPhotoId(
      (currentSelectedPhotoId) => currentSelectedPhotoId ?? fallbackSelectedPhotoId
    )
  }

  const selectPhotoHandler = (photoId: string) => {
    setSelectedPhotoId(photoId)
  }

  const selectFirstPhotoHandler = () => {
    setSelectedPhotoId(photosRef.current[0]?.id ?? null)
  }

  const removePhotoHandler = (photoId: string) => {
    const currentPhotos = photosRef.current
    const removedPhotoIndex = currentPhotos.findIndex((photo) => photo.id === photoId)

    if (removedPhotoIndex === -1) {
      return
    }

    const removedPhoto = currentPhotos[removedPhotoIndex]
    const nextPhotos = currentPhotos.filter((photo) => photo.id !== photoId)
    const currentSelectedPhotoId = selectedPhotoId ?? currentPhotos[0]?.id ?? null
    const nextSelectedPhotoId =
      currentSelectedPhotoId !== photoId &&
      nextPhotos.some(({ id }) => id === currentSelectedPhotoId)
        ? currentSelectedPhotoId
        : (nextPhotos[Math.min(removedPhotoIndex, nextPhotos.length - 1)]?.id ?? null)

    URL.revokeObjectURL(removedPhoto.previewUrl)
    commitPhotosHandler(nextPhotos)
    setSelectedPhotoId(nextSelectedPhotoId)
  }

  const resetPhotosHandler = () => {
    revokePhotoPreviewUrls(photosRef.current)
    commitPhotosHandler([])
    setSelectedPhotoId(null)
  }

  const restorePhotosHandler = (
    draftPhotos: CreatePostPhotoPreviewSource[],
    draftSelectedPhotoId: string | null
  ) => {
    const restoredPhotos = draftPhotos.map(restoreImagePreview)
    const hasDraftSelectedPhoto = restoredPhotos.some(({ id }) => id === draftSelectedPhotoId)

    revokePhotoPreviewUrls(photosRef.current)
    commitPhotosHandler(restoredPhotos)
    setSelectedPhotoId(
      hasDraftSelectedPhoto ? draftSelectedPhotoId : (restoredPhotos[0]?.id ?? null)
    )
  }

  const updateSelectedPhotoHandler = (updatePhoto: (photo: CreatePostPhoto) => CreatePostPhoto) => {
    if (!selectedPhoto) {
      return
    }

    setPhotos((currentPhotos) =>
      currentPhotos.map((photo) => (photo.id === selectedPhoto.id ? updatePhoto(photo) : photo))
    )
  }

  const updateSelectedPhotoCropHandler = (crop: CreatePostPoint) => {
    updateSelectedPhotoHandler((photo) => ({ ...photo, crop }))
  }

  const updateSelectedPhotoZoomHandler = (zoom: number) => {
    updateSelectedPhotoHandler((photo) => ({ ...photo, zoom }))
  }

  const updateSelectedPhotoAspectHandler = (aspectId: CreatePostAspectId) => {
    updateSelectedPhotoHandler((photo) => ({
      ...photo,
      aspectId,
      crop: { ...DEFAULT_CREATE_POST_CROP },
      zoom: DEFAULT_CREATE_POST_ZOOM,
      croppedAreaPixels: null,
    }))
  }

  const updateSelectedPhotoCroppedAreaHandler = (croppedAreaPixels: CreatePostCropArea) => {
    updateSelectedPhotoHandler((photo) => ({ ...photo, croppedAreaPixels }))
  }

  const updateSelectedPhotoFilterHandler = (filterId: CreatePostFilterId) => {
    updateSelectedPhotoHandler((photo) => ({ ...photo, filterId }))
  }

  const updateSelectedPhotoImageSizeHandler = (imageSize: CreatePostImageSize) => {
    updateSelectedPhotoHandler((photo) => ({ ...photo, imageSize }))
  }

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
