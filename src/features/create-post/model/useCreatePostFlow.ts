import { useState } from 'react'

import { normalizePostDescription } from '@/entities/post'

import { usePublishPostMutation } from '../api/usePublishPostMutation'
import { exportEditedImage } from '../lib/exportEditedImage'
import { createPostDraftFromState } from './createPostDraft'
import { validateCreatePostFiles } from './createPostFile'
import type { CreatePostStep } from './createPostFlow'
import { getCreatePostPublishErrorMessage } from './createPostPublishError'
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

  const selectPhotosHandler = (files: File[]) => {
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
  }

  const openCropStepHandler = () => {
    setStep('crop')
  }

  const openFiltersStepHandler = () => {
    selectFirstPhotoHandler()
    setStep('filters')
  }

  const openPublicationStepHandler = () => {
    selectFirstPhotoHandler()
    setStep('publication')
  }

  const removePhotoFromFlowHandler = (photoId: string) => {
    removePhotoHandler(photoId)

    if (photos.length <= 1) {
      setStep('add-photo')
    }
  }

  const updateDescriptionHandler = (descriptionValue: string) => {
    setDescription(normalizePostDescription(descriptionValue))
  }

  const resetFlowHandler = () => {
    resetPhotosHandler()
    setDescription('')
    setPublishError(null)
    setUploadError(null)
    setStep('add-photo')
  }

  const saveCurrentDraftHandler = () => {
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
  }

  const openDraftHandler = () => {
    const draft = getDraftHandler()

    if (!draft) {
      return
    }

    restorePhotosHandler(draft.photos, draft.selectedPhotoId)
    setDescription(draft.description)
    setPublishError(null)
    setUploadError(null)
    setStep(draft.step)
  }

  const discardCreationHandler = () => {
    clearDraftHandler()
    resetFlowHandler()
  }

  const publishPostHandler = async (onSuccess: () => void) => {
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
          onError: (error) => {
            setPublishError(getCreatePostPublishErrorMessage(error))
          },
        }
      )
    } catch {
      setPublishError('Failed to prepare photos for publication.')
    }
  }

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
