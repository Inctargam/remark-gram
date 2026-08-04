import Image from 'next/image'

import { Icon } from '@/shared/ui/icon'

import type { CreatePostPhoto } from '../../model/createPostFile'
import styles from '../createPost.module.css'

type Props = {
  photos: CreatePostPhoto[]
  selectedPhotoId: string | null
  onAddPhotos: () => void
  onPhotoRemove: (photoId: string) => void
  onPhotoSelect: (photoId: string) => void
}

export const SelectedPhotosList = ({
  photos,
  selectedPhotoId,
  onAddPhotos,
  onPhotoRemove,
  onPhotoSelect,
}: Props) => (
  <div className={styles.selectedPhotosList} aria-label="Selected photos">
    {photos.map((photo, index) => {
      const isSelected = photo.id === selectedPhotoId

      return (
        <div className={styles.thumbnailItem} key={photo.id}>
          <button
            className={styles.thumbnailButton}
            data-selected={isSelected ? '' : undefined}
            type="button"
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
          <button
            className={styles.removeThumbnailButton}
            type="button"
            aria-label={`Remove photo ${index + 1}`}
            onClick={() => onPhotoRemove(photo.id)}>
            <Icon iconId="icon-close-outline" width={14} height={14} />
          </button>
        </div>
      )
    })}
    <button
      className={styles.addThumbnailButton}
      type="button"
      aria-label="Add photos"
      onClick={onAddPhotos}>
      <Icon iconId="icon-image-outline" width={24} height={24} />
    </button>
  </div>
)
