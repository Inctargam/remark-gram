import { Modal } from '@/shared/ui/modal'

import type {
  CreatePostAspectId,
  CreatePostCropArea,
  CreatePostPoint,
} from '../model/createPostCrop'
import type { CreatePostPhoto } from '../model/createPostFile'
import type { CreatePostFilterId } from '../model/createPostFilter'
import { AddPhotoStep } from './AddPhotoStep'
import styles from './createPostPage.module.css'
import { CropPhotoStep } from './CropPhotoStep'
import { FilterPhotoStep } from './FilterPhotoStep'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  photos: CreatePostPhoto[]
  selectedPhoto: CreatePostPhoto | null
  selectedPhotoId: string | null
  step: 'add-photo' | 'crop' | 'filters'
  uploadError: string | null
  onAspectChange: (aspectId: CreatePostAspectId) => void
  onBackToCrop: () => void
  onCropChange: (crop: CreatePostPoint) => void
  onCropComplete: (croppedAreaPixels: CreatePostCropArea) => void
  onFilterChange: (filterId: CreatePostFilterId) => void
  onNextFromCrop: () => void
  onPhotoSelect: (photoId: string) => void
  onPhotosSelect: (files: File[]) => void
  onZoomChange: (zoom: number) => void
}

export const CreatePostModal = ({
  open,
  onOpenChange,
  photos,
  selectedPhoto,
  selectedPhotoId,
  step,
  uploadError,
  onAspectChange,
  onBackToCrop,
  onCropChange,
  onCropComplete,
  onFilterChange,
  onNextFromCrop,
  onPhotoSelect,
  onPhotosSelect,
  onZoomChange,
}: Props) => {
  const isEditorStep = (step === 'crop' || step === 'filters') && selectedPhoto

  return (
    <Modal
      className={isEditorStep ? styles.editorModal : styles.addPhotoModal}
      open={open}
      onOpenChange={onOpenChange}
      title={step === 'filters' ? 'Filters' : step === 'crop' ? 'Cropping' : 'Add Photo'}>
      {step === 'crop' && selectedPhoto ? (
        <CropPhotoStep
          photos={photos}
          selectedPhoto={selectedPhoto}
          selectedPhotoId={selectedPhotoId}
          onAspectChange={onAspectChange}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
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
          onPhotoSelect={onPhotoSelect}
        />
      ) : (
        <AddPhotoStep uploadError={uploadError} onPhotosSelect={onPhotosSelect} />
      )}
    </Modal>
  )
}
