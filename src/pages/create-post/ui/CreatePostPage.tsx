'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ROUTES } from '@/shared/config'

import { useCreatePostFlow } from '../model/useCreatePostFlow'
import { CreatePostModal } from './CreatePostModal'

export const CreatePostPage = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)
  const {
    description,
    isPublishing,
    photos,
    publishError,
    publishPostHandler,
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

  const closeHandler = (open: boolean) => {
    setIsOpen(open)

    if (!open) {
      router.replace(ROUTES.profile)
    }
  }

  const publishHandler = () => {
    void publishPostHandler(() => {
      closeHandler(false)
    })
  }

  return (
    <CreatePostModal
      open={isOpen}
      onOpenChange={closeHandler}
      onAspectChange={updateSelectedPhotoAspectHandler}
      onBackToCrop={openCropStepHandler}
      onBackToFilters={openFiltersStepHandler}
      onCropChange={updateSelectedPhotoCropHandler}
      onCropComplete={updateSelectedPhotoCroppedAreaHandler}
      onDescriptionChange={updateDescriptionHandler}
      onFilterChange={updateSelectedPhotoFilterHandler}
      onImageSizeChange={updateSelectedPhotoImageSizeHandler}
      onNextFromCrop={openFiltersStepHandler}
      onNextFromFilters={openPublicationStepHandler}
      onPhotoSelect={updateSelectedPhotoHandler}
      onPhotosSelect={selectPhotosHandler}
      onPublish={publishHandler}
      photos={photos}
      description={description}
      isPublishing={isPublishing}
      publishError={publishError}
      selectedPhoto={selectedPhoto}
      selectedPhotoId={selectedPhotoId}
      step={step}
      uploadError={uploadError}
      onZoomChange={updateSelectedPhotoZoomHandler}
    />
  )
}
