import { useCallback, useState } from 'react'

import { usePublishPostMutation } from '../api/usePublishPostMutation'
import { exportEditedImage } from '../lib/exportEditedImage'
import { normalizeCreatePostDescription } from './createPostDescription'
import { validateCreatePostFiles } from './createPostFile'
import { useCreatePostPhotos } from './useCreatePostPhotos'

type CreatePostStep = 'add-photo' | 'crop' | 'filters' | 'publication'

export const useCreatePostFlow = () => {
  const [step, setStep] = useState<CreatePostStep>('add-photo')
  const [description, setDescription] = useState('')
  const [publishError, setPublishError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const publishPostMutation = usePublishPostMutation()
  const {
    photos,
    selectedPhoto,
    selectedPhotoId,
    addPhotosHandler,
    selectPhotoHandler,
    updateSelectedPhotoAspectHandler,
    updateSelectedPhotoCropHandler,
    updateSelectedPhotoCroppedAreaHandler,
    updateSelectedPhotoFilterHandler,
    updateSelectedPhotoImageSizeHandler,
    updateSelectedPhotoZoomHandler,
  } = useCreatePostPhotos()

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
      addPhotosHandler(files)
      setStep('crop')
    },
    [addPhotosHandler, photos.length]
  )

  const openCropStepHandler = useCallback(() => {
    setStep('crop')
  }, [])

  const openFiltersStepHandler = useCallback(() => {
    setStep('filters')
  }, [])

  const openPublicationStepHandler = useCallback(() => {
    setStep('publication')
  }, [])

  const updateDescriptionHandler = useCallback((descriptionValue: string) => {
    setDescription(normalizeCreatePostDescription(descriptionValue))
  }, [])

  const publishPostHandler = useCallback(
    async (onSuccess: () => void) => {
      setPublishError(null)

      try {
        const editedPhotos = await Promise.all(photos.map(exportEditedImage))

        publishPostMutation.mutate(
          { description, photos: editedPhotos },
          {
            onSuccess,
            onError: () => {
              setPublishError('Failed to publish the post. Please try again.')
            },
          }
        )
      } catch {
        setPublishError('Failed to prepare photos for publication.')
      }
    },
    [description, photos, publishPostMutation]
  )

  return {
    description,
    isPublishing: publishPostMutation.isPending,
    publishError,
    selectedPhoto,
    selectedPhotoId,
    step,
    photos,
    uploadError,
    openCropStepHandler,
    openFiltersStepHandler,
    openPublicationStepHandler,
    publishPostHandler,
    selectPhotosHandler,
    updateDescriptionHandler,
    updateSelectedPhotoAspectHandler,
    updateSelectedPhotoCropHandler,
    updateSelectedPhotoCroppedAreaHandler,
    updateSelectedPhotoFilterHandler,
    updateSelectedPhotoImageSizeHandler,
    updateSelectedPhotoHandler: selectPhotoHandler,
    updateSelectedPhotoZoomHandler,
  }
}
