'use client'

import { useState } from 'react'

import { useCreatePostFlow } from '../model/useCreatePostFlow'
import { CloseCreationConfirm } from './close-creation/CloseCreationConfirm'
import { CreatePostModal } from './CreatePostModal'

type Props = {
  onClose: () => void
}

export const CreatePostFlow = ({ onClose }: Props) => {
  const [isOpen, setIsOpen] = useState(true)
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false)
  const {
    abortPublicationHandler,
    description,
    discardCreationHandler,
    hasDraft,
    hasUnsavedChanges,
    isPublishing,
    openCropStepHandler,
    openDraftHandler,
    openFiltersStepHandler,
    openPublicationStepHandler,
    photos,
    publishError,
    publishPostHandler,
    removePhotoHandler,
    saveCurrentDraftHandler,
    selectPhotosHandler,
    selectedPhoto,
    selectedPhotoId,
    step,
    uploadError,
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
    onClose()
  }

  const openChangeHandler = (open: boolean) => {
    if (open) {
      setIsOpen(true)
      return
    }

    abortPublicationHandler()

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
        onPhotoRemove={removePhotoHandler}
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
