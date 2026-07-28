import clsx from 'clsx'

import { Icon } from '@/shared/ui/icon'

import type { CreatePostPhoto } from '../model/createPostFile'
import styles from './createPost.module.css'

type Props = {
  photos: CreatePostPhoto[]
  selectedPhotoId: string | null
  onPhotoSelect: (photoId: string) => void
}

export const PhotoCarouselControls = ({ photos, selectedPhotoId, onPhotoSelect }: Props) => {
  const selectedPhotoIndex = photos.findIndex(({ id }) => id === selectedPhotoId)
  const currentPhotoIndex = selectedPhotoIndex >= 0 ? selectedPhotoIndex : 0
  const previousPhoto = photos[currentPhotoIndex - 1]
  const nextPhoto = photos[currentPhotoIndex + 1]

  if (photos.length <= 1) {
    return null
  }

  return (
    <>
      {previousPhoto && (
        <button
          className={clsx(styles.carouselArrowButton, styles.carouselArrowButtonPrevious)}
          type="button"
          aria-label="Show previous photo"
          onClick={() => onPhotoSelect(previousPhoto.id)}>
          <Icon iconId="icon-arrow-ios-back" width={24} height={24} />
        </button>
      )}

      {nextPhoto && (
        <button
          className={clsx(styles.carouselArrowButton, styles.carouselArrowButtonNext)}
          type="button"
          aria-label="Show next photo"
          onClick={() => onPhotoSelect(nextPhoto.id)}>
          <Icon iconId="icon-arrow-ios-forward" width={24} height={24} />
        </button>
      )}

      <div className={styles.carouselDots} aria-label="Publication photos">
        {photos.map((photo, index) => {
          const isSelected = index === currentPhotoIndex

          return (
            <button
              className={styles.carouselDot}
              data-selected={isSelected ? '' : undefined}
              type="button"
              key={photo.id}
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={isSelected}
              onClick={() => onPhotoSelect(photo.id)}
            />
          )
        })}
      </div>
    </>
  )
}
