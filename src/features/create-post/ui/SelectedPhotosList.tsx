import Image from 'next/image'

import type { CreatePostPhoto } from '../model/createPostFile'
import styles from './createPost.module.css'

type Props = {
  photos: CreatePostPhoto[]
  selectedPhotoId: string | null
  onPhotoSelect: (photoId: string) => void
}

export const SelectedPhotosList = ({ photos, selectedPhotoId, onPhotoSelect }: Props) => (
  <div className={styles.selectedPhotosList} aria-label="Selected photos">
    {photos.map((photo, index) => {
      const isSelected = photo.id === selectedPhotoId

      return (
        <button
          className={styles.thumbnailButton}
          data-selected={isSelected ? '' : undefined}
          type="button"
          key={photo.id}
          aria-label={`Select photo ${index + 1}`}
          aria-pressed={isSelected}
          onClick={() => onPhotoSelect(photo.id)}>
          <Image
            className={styles.thumbnailImage}
            src={photo.previewUrl}
            alt=""
            width={56}
            height={56}
            unoptimized
          />
        </button>
      )
    })}
  </div>
)
