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
    photos,
    selectPhotosHandler,
    selectedPhoto,
    selectedPhotoId,
    step,
    uploadError,
    openCropStepHandler,
    openFiltersStepHandler,
    updateSelectedPhotoAspectHandler,
    updateSelectedPhotoCropHandler,
    updateSelectedPhotoCroppedAreaHandler,
    updateSelectedPhotoFilterHandler,
    updateSelectedPhotoHandler,
    updateSelectedPhotoZoomHandler,
  } = useCreatePostFlow()

  const closeHandler = (open: boolean) => {
    setIsOpen(open)

    if (!open) {
      router.replace(ROUTES.profile)
    }
  }

  return (
    <CreatePostModal
      open={isOpen}
      onOpenChange={closeHandler}
      onAspectChange={updateSelectedPhotoAspectHandler}
      onBackToCrop={openCropStepHandler}
      onCropChange={updateSelectedPhotoCropHandler}
      onCropComplete={updateSelectedPhotoCroppedAreaHandler}
      onFilterChange={updateSelectedPhotoFilterHandler}
      onNextFromCrop={openFiltersStepHandler}
      onPhotoSelect={updateSelectedPhotoHandler}
      onPhotosSelect={selectPhotosHandler}
      photos={photos}
      selectedPhoto={selectedPhoto}
      selectedPhotoId={selectedPhotoId}
      step={step}
      uploadError={uploadError}
      onZoomChange={updateSelectedPhotoZoomHandler}
    />
  )
}
