import { useCallback, useState } from 'react'

import { normalizePostDescription } from '@/entities/post'

import { usePublishPostMutation } from '../api/usePublishPostMutation'
import { exportEditedImage } from '../lib/exportEditedImage'
import { createPostDraftFromState } from './createPostDraft'
import { validateCreatePostFiles } from './createPostFile'
import type { CreatePostStep } from './createPostFlow'
import { useCreatePostDraft } from './useCreatePostDraft'
import { useCreatePostPhotos } from './useCreatePostPhotos'

export const useCreatePostFlow = () => {
  const [step, setStep] = useState<CreatePostStep>('add-photo')
  const [description, setDescription] = useState('')
  const [publishError, setPublishError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const publishPostMutation = usePublishPostMutation()
  const {
    hasDraft,
    clearDraftHandler,
    getDraftHandler,
    saveDraftHandler: saveDraftToMemoryHandler,
  } = useCreatePostDraft()
  const {
    photos,
    selectedPhoto,
    selectedPhotoId,
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
  } = useCreatePostPhotos()
  const hasUnsavedChanges = photos.length > 0 || description.length > 0

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
      setStep((currentStep) =>
        currentStep === 'add-photo' && photos.length > 0 ? currentStep : 'crop'
      )
    },
    [addPhotosHandler, photos.length]
  )

  const openCropStepHandler = useCallback(() => {
    setStep('crop')
  }, [])

  const openFiltersStepHandler = useCallback(() => {
    selectFirstPhotoHandler()
    setStep('filters')
  }, [selectFirstPhotoHandler])

  const openPublicationStepHandler = useCallback(() => {
    selectFirstPhotoHandler()
    setStep('publication')
  }, [selectFirstPhotoHandler])

  const removePhotoFromFlowHandler = useCallback(
    (photoId: string) => {
      removePhotoHandler(photoId)

      if (photos.length <= 1) {
        setStep('add-photo')
      }
    },
    [photos.length, removePhotoHandler]
  )

  const updateDescriptionHandler = useCallback((descriptionValue: string) => {
    setDescription(normalizePostDescription(descriptionValue))
  }, [])

  const resetFlowHandler = useCallback(() => {
    resetPhotosHandler()
    setDescription('')
    setPublishError(null)
    setUploadError(null)
    setStep('add-photo')
  }, [resetPhotosHandler])

  const saveCurrentDraftHandler = useCallback(() => {
    if (!hasUnsavedChanges) {
      return
    }

    saveDraftToMemoryHandler(
      createPostDraftFromState({
        description,
        photos,
        selectedPhotoId,
        step,
      })
    )
  }, [description, hasUnsavedChanges, photos, saveDraftToMemoryHandler, selectedPhotoId, step])

  const openDraftHandler = useCallback(() => {
    const draft = getDraftHandler()

    if (!draft) {
      return
    }

    restorePhotosHandler(draft.photos, draft.selectedPhotoId)
    setDescription(draft.description)
    setPublishError(null)
    setUploadError(null)
    setStep(draft.step)
  }, [getDraftHandler, restorePhotosHandler])

  const discardCreationHandler = useCallback(() => {
    clearDraftHandler()
    resetFlowHandler()
  }, [clearDraftHandler, resetFlowHandler])

  const publishPostHandler = useCallback(
    async (onSuccess: () => void) => {
      setPublishError(null)

      try {
        const editedPhotos = await Promise.all(photos.map(exportEditedImage))

        publishPostMutation.mutate(
          { description, photos: editedPhotos },
          {
            onSuccess: () => {
              clearDraftHandler()
              resetFlowHandler()
              onSuccess()
            },
            onError: () => {
              setPublishError('Failed to publish the post. Please try again.')
            },
          }
        )
      } catch {
        setPublishError('Failed to prepare photos for publication.')
      }
    },
    [clearDraftHandler, description, photos, publishPostMutation, resetFlowHandler]
  )

  return {
    description,
    hasDraft,
    hasUnsavedChanges,
    isPublishing: publishPostMutation.isPending,
    publishError,
    selectedPhoto,
    selectedPhotoId,
    step,
    photos,
    uploadError,
    discardCreationHandler,
    openCropStepHandler,
    openDraftHandler,
    openFiltersStepHandler,
    openPublicationStepHandler,
    publishPostHandler,
    removePhotoHandler: removePhotoFromFlowHandler,
    resetFlowHandler,
    saveCurrentDraftHandler,
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
