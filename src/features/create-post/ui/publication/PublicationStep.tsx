import { PostDescriptionField } from '@/entities/post'
import { Button } from '@/shared/ui/button'

import type { CreatePostPhoto } from '../../model/createPostFile'
import styles from '../createPost.module.css'
import { EditedPhotoPreview } from './EditedPhotoPreview'
import { PhotoCarouselControls } from './PhotoCarouselControls'

type Props = {
  description: string
  isPublishing: boolean
  photos: CreatePostPhoto[]
  publishError: string | null
  selectedPhoto: CreatePostPhoto
  selectedPhotoId: string | null
  onBack: () => void
  onDescriptionChange: (description: string) => void
  onPhotoSelect: (photoId: string) => void
  onPublish: () => void
}

export const PublicationStep = ({
  description,
  isPublishing,
  photos,
  publishError,
  selectedPhoto,
  selectedPhotoId,
  onBack,
  onDescriptionChange,
  onPhotoSelect,
  onPublish,
}: Props) => (
  <div className={styles.publicationContent}>
    <div className={styles.publicationPreviewPanel}>
      <div className={styles.publicationPreviewFrame}>
        <EditedPhotoPreview photo={selectedPhoto} alt="Publication preview" />
        <PhotoCarouselControls
          photos={photos}
          selectedPhotoId={selectedPhotoId}
          onPhotoSelect={onPhotoSelect}
        />
      </div>
    </div>

    <div className={styles.publicationForm}>
      <PostDescriptionField
        label="Description"
        value={description}
        onChange={onDescriptionChange}
      />

      {publishError && (
        <p className={styles.publishError} role="alert">
          {publishError}
        </p>
      )}

      <div className={styles.stepActions}>
        <Button type="button" variant="outline" disabled={isPublishing} onClick={onBack}>
          Back
        </Button>
        <Button type="button" disabled={isPublishing} onClick={onPublish}>
          {isPublishing ? 'Publishing...' : 'Publish'}
        </Button>
      </div>
    </div>
  </div>
)
