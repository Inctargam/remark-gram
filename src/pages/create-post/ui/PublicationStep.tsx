import Image from 'next/image'
import type { ChangeEvent } from 'react'

import { Button } from '@/shared/ui/button'
import { TextArea } from '@/shared/ui/textarea'

import {
  CREATE_POST_DESCRIPTION_MAX_LENGTH,
  normalizeCreatePostDescription,
} from '../model/createPostDescription'
import type { CreatePostPhoto } from '../model/createPostFile'
import { getCreatePostFilterCss } from '../model/createPostFilter'
import styles from './createPostPage.module.css'

type Props = {
  description: string
  selectedPhoto: CreatePostPhoto
  onBack: () => void
  onDescriptionChange: (description: string) => void
}

export const PublicationStep = ({
  description,
  selectedPhoto,
  onBack,
  onDescriptionChange,
}: Props) => {
  const selectedFilterCss = getCreatePostFilterCss(selectedPhoto.filterId)

  const descriptionChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    onDescriptionChange(normalizeCreatePostDescription(event.currentTarget.value))
  }

  return (
    <div className={styles.publicationContent}>
      <div className={styles.publicationPreviewFrame}>
        <Image
          className={styles.publicationPreviewImage}
          src={selectedPhoto.previewUrl}
          alt="Publication preview"
          width={492}
          height={492}
          style={{ filter: selectedFilterCss }}
          unoptimized
        />
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

        <div className={styles.stepActions}>
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="button" disabled>
            Publish
          </Button>
        </div>
      </div>
    </div>
  )
}
