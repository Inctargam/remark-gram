import { Modal } from '@/shared/ui/modal'

import type {
  CreatePostAspectId,
  CreatePostCropArea,
  CreatePostPoint,
} from '../model/createPostCrop'
import type { CreatePostPhoto } from '../model/createPostFile'
import { AddPhotoStep } from './AddPhotoStep'
import styles from './createPostPage.module.css'
import { CropPhotoStep } from './CropPhotoStep'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  photos: CreatePostPhoto[]
  selectedPhoto: CreatePostPhoto | null
  selectedPhotoId: string | null
  step: 'add-photo' | 'crop'
  uploadError: string | null
  onAspectChange: (aspectId: CreatePostAspectId) => void
  onCropChange: (crop: CreatePostPoint) => void
  onCropComplete: (croppedAreaPixels: CreatePostCropArea) => void
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
  onCropChange,
  onCropComplete,
  onPhotoSelect,
  onPhotosSelect,
  onZoomChange,
}: Props) => {
  const isCropStep = step === 'crop' && selectedPhoto

  return (
    <Modal
      className={isCropStep ? styles.cropModal : styles.addPhotoModal}
      open={open}
      onOpenChange={onOpenChange}
      title={isCropStep ? 'Cropping' : 'Add Photo'}>
      {isCropStep ? (
        <CropPhotoStep
          photos={photos}
          selectedPhoto={selectedPhoto}
          selectedPhotoId={selectedPhotoId}
          onAspectChange={onAspectChange}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onPhotoSelect={onPhotoSelect}
          onZoomChange={onZoomChange}
        />
      ) : (
        <AddPhotoStep uploadError={uploadError} onPhotosSelect={onPhotosSelect} />
      )}
    </Modal>
  )
}
