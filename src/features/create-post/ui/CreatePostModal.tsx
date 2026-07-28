import { Modal } from '@/shared/ui/modal'

import type {
  CreatePostAspectId,
  CreatePostCropArea,
  CreatePostImageSize,
  CreatePostPoint,
} from '../model/createPostCrop'
import type { CreatePostPhoto } from '../model/createPostFile'
import type { CreatePostFilterId } from '../model/createPostFilter'
import { AddPhotoStep } from './AddPhotoStep'
import styles from './createPost.module.css'
import { CropPhotoStep } from './CropPhotoStep'
import { FilterPhotoStep } from './FilterPhotoStep'
import { PublicationStep } from './PublicationStep'

type Props = {
  description: string
  hasDraft: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  photos: CreatePostPhoto[]
  isPublishing: boolean
  publishError: string | null
  selectedPhoto: CreatePostPhoto | null
  selectedPhotoId: string | null
  step: 'add-photo' | 'crop' | 'filters' | 'publication'
  uploadError: string | null
  onAspectChange: (aspectId: CreatePostAspectId) => void
  onBackToCrop: () => void
  onBackToFilters: () => void
  onCropChange: (crop: CreatePostPoint) => void
  onCropComplete: (croppedAreaPixels: CreatePostCropArea) => void
  onDescriptionChange: (description: string) => void
  onDraftOpen: () => void
  onFilterChange: (filterId: CreatePostFilterId) => void
  onImageSizeChange: (imageSize: CreatePostImageSize) => void
  onNextFromCrop: () => void
  onNextFromFilters: () => void
  onPhotoSelect: (photoId: string) => void
  onPhotosSelect: (files: File[]) => void
  onPublish: () => void
  onZoomChange: (zoom: number) => void
}

export const CreatePostModal = ({
  description,
  hasDraft,
  open,
  onOpenChange,
  photos,
  isPublishing,
  publishError,
  selectedPhoto,
  selectedPhotoId,
  step,
  uploadError,
  onAspectChange,
  onBackToCrop,
  onBackToFilters,
  onCropChange,
  onCropComplete,
  onDescriptionChange,
  onDraftOpen,
  onFilterChange,
  onImageSizeChange,
  onNextFromCrop,
  onNextFromFilters,
  onPhotoSelect,
  onPhotosSelect,
  onPublish,
  onZoomChange,
}: Props) => {
  const isEditorStep =
    (step === 'crop' || step === 'filters' || step === 'publication') && selectedPhoto
  const modalTitle =
    step === 'publication'
      ? 'Publication'
      : step === 'filters'
        ? 'Filters'
        : step === 'crop'
          ? 'Cropping'
          : 'Add Photo'

  return (
    <Modal
      className={isEditorStep ? styles.editorModal : styles.addPhotoModal}
      open={open}
      onOpenChange={onOpenChange}
      title={modalTitle}>
      {step === 'crop' && selectedPhoto ? (
        <CropPhotoStep
          photos={photos}
          selectedPhoto={selectedPhoto}
          selectedPhotoId={selectedPhotoId}
          onAspectChange={onAspectChange}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onImageSizeChange={onImageSizeChange}
          onPhotoSelect={onPhotoSelect}
          onNext={onNextFromCrop}
          onZoomChange={onZoomChange}
        />
      ) : step === 'filters' && selectedPhoto ? (
        <FilterPhotoStep
          photos={photos}
          selectedPhoto={selectedPhoto}
          selectedPhotoId={selectedPhotoId}
          onBack={onBackToCrop}
          onFilterChange={onFilterChange}
          onNext={onNextFromFilters}
          onPhotoSelect={onPhotoSelect}
        />
      ) : step === 'publication' && selectedPhoto ? (
        <PublicationStep
          description={description}
          isPublishing={isPublishing}
          photos={photos}
          publishError={publishError}
          selectedPhoto={selectedPhoto}
          selectedPhotoId={selectedPhotoId}
          onBack={onBackToFilters}
          onDescriptionChange={onDescriptionChange}
          onPhotoSelect={onPhotoSelect}
          onPublish={onPublish}
        />
      ) : (
        <AddPhotoStep
          hasDraft={hasDraft}
          uploadError={uploadError}
          onDraftOpen={onDraftOpen}
          onPhotosSelect={onPhotosSelect}
        />
      )}
    </Modal>
  )
}
