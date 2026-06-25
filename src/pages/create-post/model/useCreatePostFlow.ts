import { useCallback, useEffect, useRef, useState } from 'react'

import { createImagePreview } from '../lib/createImagePreview'
import type { CreatePostPhoto } from './createPostFile'
import { validateCreatePostFiles } from './createPostFile'

export const useCreatePostFlow = () => {
  const [photos, setPhotos] = useState<CreatePostPhoto[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)
  const photosRef = useRef<CreatePostPhoto[]>([])

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
      setPhotos((currentPhotos) => [...currentPhotos, ...files.map(createImagePreview)])
    },
    [photos.length]
  )

  return {
    photos,
    uploadError,
    selectPhotosHandler,
  }
}
