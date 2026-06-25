import type { ChangeEvent } from 'react'
import Cropper, { type Area, type Point } from 'react-easy-crop'

import { Button } from '@/shared/ui/button'

import {
  CREATE_POST_ASPECTS,
  CREATE_POST_ZOOM_STEP,
  type CreatePostAspectId,
  MAX_CREATE_POST_ZOOM,
  MIN_CREATE_POST_ZOOM,
} from '../model/createPostCrop'
import type { CreatePostPhoto } from '../model/createPostFile'
import styles from './createPostPage.module.css'
import { SelectedPhotosList } from './SelectedPhotosList'

type Props = {
  photos: CreatePostPhoto[]
  selectedPhoto: CreatePostPhoto
  selectedPhotoId: string | null
  onAspectChange: (aspectId: CreatePostAspectId) => void
  onCropChange: (crop: Point) => void
  onCropComplete: (croppedAreaPixels: Area) => void
  onNext: () => void
  onPhotoSelect: (photoId: string) => void
  onZoomChange: (zoom: number) => void
}

export const CropPhotoStep = ({
  photos,
  selectedPhoto,
  selectedPhotoId,
  onAspectChange,
  onCropChange,
  onCropComplete,
  onNext,
  onPhotoSelect,
  onZoomChange,
}: Props) => {
  const selectedAspect =
    CREATE_POST_ASPECTS.find(({ id }) => id === selectedPhoto.aspectId) ?? CREATE_POST_ASPECTS[0]

  const cropCompleteHandler = (_croppedArea: Area, croppedAreaPixels: Area) => {
    onCropComplete(croppedAreaPixels)
  }

  const zoomChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    onZoomChange(Number(event.currentTarget.value))
  }

  return (
    <div className={styles.cropContent}>
      <div className={styles.cropperPanel}>
        <div className={styles.cropperFrame}>
          <Cropper
            image={selectedPhoto.previewUrl}
            crop={selectedPhoto.crop}
            zoom={selectedPhoto.zoom}
            aspect={selectedAspect.value}
            minZoom={MIN_CREATE_POST_ZOOM}
            maxZoom={MAX_CREATE_POST_ZOOM}
            onCropChange={onCropChange}
            onCropComplete={cropCompleteHandler}
            onZoomChange={onZoomChange}
          />
        </div>

        <SelectedPhotosList
          photos={photos}
          selectedPhotoId={selectedPhotoId}
          onPhotoSelect={onPhotoSelect}
        />
      </div>

      <div className={styles.cropControls}>
        <fieldset className={styles.controlGroup}>
          <legend className={styles.controlLabel}>Photo format</legend>
          <div className={styles.aspectOptions}>
            {CREATE_POST_ASPECTS.map(({ id, label }) => (
              <button
                className={styles.aspectButton}
                data-selected={id === selectedPhoto.aspectId ? '' : undefined}
                type="button"
                key={id}
                aria-pressed={id === selectedPhoto.aspectId}
                onClick={() => onAspectChange(id)}>
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className={styles.controlGroup}>
          <span className={styles.controlLabel}>Zoom</span>
          <input
            className={styles.zoomControl}
            type="range"
            min={MIN_CREATE_POST_ZOOM}
            max={MAX_CREATE_POST_ZOOM}
            step={CREATE_POST_ZOOM_STEP}
            value={selectedPhoto.zoom}
            onChange={zoomChangeHandler}
          />
        </label>

        <Button className={styles.nextButton} type="button" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  )
}
