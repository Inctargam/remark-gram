import { useRef, useState } from 'react'

import { normalizePostDescription } from '@/entities/post'

import { isPublishPostAbortError } from '../api/publishPostApi'
import { usePublishPostMutation } from '../api/usePublishPostMutation'
import { exportEditedImage, type ExportedPostPhoto } from '../lib/exportEditedImage'
import { createPostDraftFromState } from './createPostDraft'
import { validateCreatePostFiles } from './createPostFile'
import type { CreatePostStep } from './createPostFlow'
import { getCreatePostPublishErrorMessage } from './createPostPublishError'
import { useCreatePostDraft } from './useCreatePostDraft'
import { useCreatePostPhotos } from './useCreatePostPhotos'

export const useCreatePostFlow = () => {
  const [step, setStep] = useState<CreatePostStep>('add-photo')
  const [description, setDescription] = useState('')
  const [isPreparingPublication, setIsPreparingPublication] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const isPublishInFlightRef = useRef(false)
  const publishAbortControllerRef = useRef<AbortController | null>(null)
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
    publishAbortControllerRef.current?.abort()
    publishAbortControllerRef.current = null
    isPublishInFlightRef.current = false
    resetPhotosHandler()
    setDescription('')
    setPublishError(null)
    setUploadError(null)
    setStep('add-photo')
  }

  const saveCurrentDraftHandler = () => {
    publishAbortControllerRef.current?.abort()

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
    publishAbortControllerRef.current?.abort()
    clearDraftHandler()
    resetFlowHandler()
  }

  const abortPublicationHandler = () => {
    publishAbortControllerRef.current?.abort()
  }

  const publishPostHandler = async (onSuccess: () => void) => {
    if (isPublishInFlightRef.current) {
      return
    }

    isPublishInFlightRef.current = true
    publishAbortControllerRef.current?.abort()
    const abortController = new AbortController()

    publishAbortControllerRef.current = abortController
    setPublishError(null)
    setIsPreparingPublication(true)

    let editedPhotos: ExportedPostPhoto[]

    try {
      editedPhotos = await Promise.all(photos.map(exportEditedImage))
      if (abortController.signal.aborted) {
        setIsPreparingPublication(false)
        isPublishInFlightRef.current = false
        if (publishAbortControllerRef.current === abortController) {
          publishAbortControllerRef.current = null
        }
        return
      }
    } catch {
      if (abortController.signal.aborted) {
        setIsPreparingPublication(false)
        isPublishInFlightRef.current = false
        if (publishAbortControllerRef.current === abortController) {
          publishAbortControllerRef.current = null
        }
        return
      }

      setPublishError('Failed to prepare photos for publication.')
      setIsPreparingPublication(false)
      isPublishInFlightRef.current = false
      return
    }

    try {
      setIsPreparingPublication(false)
      await publishPostMutation.mutateAsync({
        payload: { description, photos: editedPhotos },
        signal: abortController.signal,
      })
      clearDraftHandler()
      resetFlowHandler()
      onSuccess()
    } catch (error) {
      if (abortController.signal.aborted || isPublishPostAbortError(error)) {
        return
      }

      setPublishError(getCreatePostPublishErrorMessage(error))
    } finally {
      setIsPreparingPublication(false)
      isPublishInFlightRef.current = false
      if (publishAbortControllerRef.current === abortController) {
        publishAbortControllerRef.current = null
      }
    }
  }

  return {
    description,
    hasDraft,
    hasUnsavedChanges,
    isPublishing: isPreparingPublication || publishPostMutation.isPending,
    publishError,
    selectedPhoto,
    selectedPhotoId,
    step,
    photos,
    uploadError,
    abortPublicationHandler,
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
