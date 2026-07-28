import Image from 'next/image'

import { Button } from '@/shared/ui/button'

import type { CreatePostPhoto } from '../model/createPostFile'
import { CREATE_POST_FILTERS, type CreatePostFilterId } from '../model/createPostFilter'
import styles from './createPost.module.css'
import { EditedPhotoPreview } from './EditedPhotoPreview'
import { PhotoCarouselControls } from './PhotoCarouselControls'

type Props = {
  photos: CreatePostPhoto[]
  selectedPhoto: CreatePostPhoto
  selectedPhotoId: string | null
  onBack: () => void
  onFilterChange: (filterId: CreatePostFilterId) => void
  onNext: () => void
  onPhotoSelect: (photoId: string) => void
}

export const FilterPhotoStep = ({
  photos,
  selectedPhoto,
  selectedPhotoId,
  onBack,
  onFilterChange,
  onNext,
  onPhotoSelect,
}: Props) => {
  return (
    <div className={styles.filterContent}>
      <div className={styles.filterPreviewPanel}>
        <div className={styles.filterPreviewFrame}>
          <EditedPhotoPreview photo={selectedPhoto} alt="Filtered publication preview" />
          <PhotoCarouselControls
            photos={photos}
            selectedPhotoId={selectedPhotoId}
            onPhotoSelect={onPhotoSelect}
          />
        </div>
      </div>

      <div className={styles.filterControls}>
        <fieldset className={styles.controlGroup}>
          <legend className={styles.controlLabel}>Filters</legend>
          <div className={styles.filterOptions}>
            {CREATE_POST_FILTERS.map(({ cssFilter, id, label }) => (
              <button
                className={styles.filterButton}
                data-selected={id === selectedPhoto.filterId ? '' : undefined}
                type="button"
                key={id}
                aria-pressed={id === selectedPhoto.filterId}
                onClick={() => onFilterChange(id)}>
                <span className={styles.filterSwatch}>
                  <Image
                    className={styles.filterSwatchImage}
                    src={selectedPhoto.previewUrl}
                    alt=""
                    width={48}
                    height={48}
                    style={{ filter: cssFilter }}
                    unoptimized
                  />
                </span>
                <span className={styles.filterLabel}>{label}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className={styles.stepActions}>
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="button" onClick={onNext}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
