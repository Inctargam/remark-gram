import { useCallback, useState } from 'react'

import { normalizeCreatePostDescription } from './createPostDescription'
import { validateCreatePostFiles } from './createPostFile'
import { useCreatePostPhotos } from './useCreatePostPhotos'

type CreatePostStep = 'add-photo' | 'crop' | 'filters' | 'publication'

export const useCreatePostFlow = () => {
  const [step, setStep] = useState<CreatePostStep>('add-photo')
  const [description, setDescription] = useState('')
  const [uploadError, setUploadError] = useState<string | null>(null)
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

  return {
    description,
    selectedPhoto,
    selectedPhotoId,
    step,
    photos,
    uploadError,
    openCropStepHandler,
    openFiltersStepHandler,
    openPublicationStepHandler,
    selectPhotosHandler,
    updateDescriptionHandler,
    updateSelectedPhotoAspectHandler,
    updateSelectedPhotoCropHandler,
    updateSelectedPhotoCroppedAreaHandler,
    updateSelectedPhotoFilterHandler,
    updateSelectedPhotoHandler: selectPhotoHandler,
    updateSelectedPhotoZoomHandler,
  }
}
