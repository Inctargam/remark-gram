import type { ChangeEvent } from 'react'

import { Button } from '@/shared/ui/button'
import { TextArea } from '@/shared/ui/textarea'

import {
  CREATE_POST_DESCRIPTION_MAX_LENGTH,
  normalizeCreatePostDescription,
} from '../model/createPostDescription'
import type { CreatePostPhoto } from '../model/createPostFile'
import styles from './createPost.module.css'
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
}: Props) => {
  const descriptionChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    onDescriptionChange(normalizeCreatePostDescription(event.currentTarget.value))
  }

  return (
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
        <TextArea
          className={styles.descriptionField}
          label="Description"
          maxLength={CREATE_POST_DESCRIPTION_MAX_LENGTH}
          placeholder="Add publication description"
          value={description}
          onChange={descriptionChangeHandler}
        />
        <p className={styles.descriptionCounter}>
          {description.length}/{CREATE_POST_DESCRIPTION_MAX_LENGTH}
        </p>

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
}
