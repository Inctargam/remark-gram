'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ROUTES } from '@/shared/config'

import { useCreatePostFlow } from '../model/useCreatePostFlow'
import { CloseCreationConfirm } from './CloseCreationConfirm'
import { CreatePostModal } from './CreatePostModal'

export const CreatePostPage = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false)
  const {
    description,
    discardCreationHandler,
    hasDraft,
    hasUnsavedChanges,
    isPublishing,
    openDraftHandler,
    photos,
    publishError,
    publishPostHandler,
    saveCurrentDraftHandler,
    selectPhotosHandler,
    selectedPhoto,
    selectedPhotoId,
    step,
    uploadError,
    openCropStepHandler,
    openFiltersStepHandler,
    openPublicationStepHandler,
    updateDescriptionHandler,
    updateSelectedPhotoAspectHandler,
    updateSelectedPhotoCropHandler,
    updateSelectedPhotoCroppedAreaHandler,
    updateSelectedPhotoFilterHandler,
    updateSelectedPhotoHandler,
    updateSelectedPhotoImageSizeHandler,
    updateSelectedPhotoZoomHandler,
  } = useCreatePostFlow()
  const shouldConfirmClose = hasUnsavedChanges

  const closeCreatePostHandler = () => {
    setIsOpen(false)
    router.replace(ROUTES.profile)
  }

  const openChangeHandler = (open: boolean) => {
    if (open) {
      setIsOpen(true)
      return
    }

    if (shouldConfirmClose) {
      setIsCloseConfirmOpen(true)
      return
    }

    closeCreatePostHandler()
  }

  const closeConfirmOpenChangeHandler = (open: boolean) => {
    setIsCloseConfirmOpen(open)
  }

  const saveDraftAndCloseHandler = () => {
    saveCurrentDraftHandler()
    setIsCloseConfirmOpen(false)
    closeCreatePostHandler()
  }

  const discardAndCloseHandler = () => {
    discardCreationHandler()
    setIsCloseConfirmOpen(false)
    closeCreatePostHandler()
  }

  const publishHandler = () => {
    void publishPostHandler(() => {
      closeCreatePostHandler()
    })
  }

  return (
    <>
      <CreatePostModal
        open={isOpen}
        onOpenChange={openChangeHandler}
        onAspectChange={updateSelectedPhotoAspectHandler}
        onBackToCrop={openCropStepHandler}
        onBackToFilters={openFiltersStepHandler}
        onCropChange={updateSelectedPhotoCropHandler}
        onCropComplete={updateSelectedPhotoCroppedAreaHandler}
        onDescriptionChange={updateDescriptionHandler}
        onDraftOpen={openDraftHandler}
        onFilterChange={updateSelectedPhotoFilterHandler}
        onImageSizeChange={updateSelectedPhotoImageSizeHandler}
        onNextFromCrop={openFiltersStepHandler}
        onNextFromFilters={openPublicationStepHandler}
        onPhotoSelect={updateSelectedPhotoHandler}
        onPhotosSelect={selectPhotosHandler}
        onPublish={publishHandler}
        photos={photos}
        description={description}
        hasDraft={hasDraft}
        isPublishing={isPublishing}
        publishError={publishError}
        selectedPhoto={selectedPhoto}
        selectedPhotoId={selectedPhotoId}
        step={step}
        uploadError={uploadError}
        onZoomChange={updateSelectedPhotoZoomHandler}
      />

      <CloseCreationConfirm
        open={isCloseConfirmOpen}
        onDiscard={discardAndCloseHandler}
        onOpenChange={closeConfirmOpenChangeHandler}
        onSaveDraft={saveDraftAndCloseHandler}
      />
    </>
  )
}
