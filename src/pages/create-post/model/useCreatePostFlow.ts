import { useCallback, useState } from 'react'

import { validateCreatePostFiles } from './createPostFile'
import { useCreatePostPhotos } from './useCreatePostPhotos'

type CreatePostStep = 'add-photo' | 'crop' | 'filters'

export const useCreatePostFlow = () => {
  const [step, setStep] = useState<CreatePostStep>('add-photo')
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

  return {
    selectedPhoto,
    selectedPhotoId,
    step,
    photos,
    uploadError,
    openCropStepHandler,
    openFiltersStepHandler,
    selectPhotosHandler,
    updateSelectedPhotoAspectHandler,
    updateSelectedPhotoCropHandler,
    updateSelectedPhotoCroppedAreaHandler,
    updateSelectedPhotoFilterHandler,
    updateSelectedPhotoHandler: selectPhotoHandler,
    updateSelectedPhotoZoomHandler,
  }
}
