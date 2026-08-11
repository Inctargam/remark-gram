import { Icon } from '@/shared/ui/icon'
import { Modal } from '@/shared/ui/modal'

import type {
  CreatePostAspectId,
  CreatePostCropArea,
  CreatePostImageSize,
  CreatePostPoint,
} from '../model/createPostCrop'
import type { CreatePostPhoto } from '../model/createPostFile'
import type { CreatePostFilterId } from '../model/createPostFilter'
import { AddPhotoStep } from './add-photo/AddPhotoStep'
import styles from './createPost.module.css'
import { CropPhotoStep } from './crop-photo/CropPhotoStep'
import { FilterPhotoStep } from './filter-photo/FilterPhotoStep'
import { PublicationStep } from './publication/PublicationStep'

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
  onPhotoRemove: (photoId: string) => void
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
  onPhotoRemove,
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
  const backHandler =
    step === 'publication' ? onBackToFilters : step === 'filters' ? onBackToCrop : null
  const headerStart = backHandler ? (
    <button
      className={styles.headerBackButton}
      type="button"
      aria-label="Back to previous create post step"
      onClick={backHandler}>
      <Icon iconId="icon-arrow-ios-back" width={24} height={24} />
    </button>
  ) : null

  return (
    <Modal
      className={isEditorStep ? styles.editorModal : styles.addPhotoModal}
      open={open}
      onOpenChange={onOpenChange}
      headerStart={headerStart}
      title={modalTitle}>
      {step === 'crop' && selectedPhoto ? (
        <CropPhotoStep
          photos={photos}
          selectedPhoto={selectedPhoto}
          selectedPhotoId={selectedPhotoId}
          uploadError={uploadError}
          onAspectChange={onAspectChange}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onImageSizeChange={onImageSizeChange}
          onPhotoRemove={onPhotoRemove}
          onPhotoSelect={onPhotoSelect}
          onPhotosSelect={onPhotosSelect}
          onNext={onNextFromCrop}
          onZoomChange={onZoomChange}
        />
      ) : step === 'filters' && selectedPhoto ? (
        <FilterPhotoStep
          photos={photos}
          selectedPhoto={selectedPhoto}
          selectedPhotoId={selectedPhotoId}
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
