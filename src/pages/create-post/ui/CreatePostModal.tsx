import Image from 'next/image'
import type { ChangeEvent } from 'react'
import { useRef } from 'react'

import { Button } from '@/shared/ui/button'
import { Icon } from '@/shared/ui/icon'
import { Modal } from '@/shared/ui/modal'

import type { CreatePostPhoto } from '../model/createPostFile'
import styles from './createPostPage.module.css'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  photos: CreatePostPhoto[]
  uploadError: string | null
  onPhotosSelect: (files: File[]) => void
}

export const CreatePostModal = ({
  open,
  onOpenChange,
  photos,
  uploadError,
  onPhotosSelect,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const firstPhoto = photos[0]
  const hasPhotos = photos.length > 0

  const selectFromComputerHandler = () => {
    fileInputRef.current?.click()
  }

  const fileChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.currentTarget.files ?? [])

    onPhotosSelect(selectedFiles)
    event.currentTarget.value = ''
  }

  return (
    <Modal className={styles.modal} open={open} onOpenChange={onOpenChange} title="Add Photo">
      <div className={styles.content}>
        <input
          ref={fileInputRef}
          className={styles.fileInput}
          type="file"
          accept="image/jpeg,image/png"
          multiple
          onChange={fileChangeHandler}
        />

        <div className={styles.placeholder} aria-live="polite">
          {hasPhotos ? (
            <Image
              className={styles.preview}
              src={firstPhoto.previewUrl}
              alt="Selected publication preview"
              width={222}
              height={228}
              unoptimized
            />
          ) : (
            <Icon
              className={styles.placeholderIcon}
              iconId="icon-image-outline"
              width={48}
              height={48}
            />
          )}
        </div>

        {hasPhotos && (
          <p className={styles.selectionStatus}>
            {photos.length === 1 ? '1 photo selected' : `${photos.length} photos selected`}
          </p>
        )}

        {uploadError && (
          <p className={styles.uploadError} role="alert">
            {uploadError}
          </p>
        )}

        <div className={styles.actions}>
          <Button type="button" onClick={selectFromComputerHandler}>
            Select from Computer
          </Button>
          <Button className={styles.openDraftButton} type="button" variant="outline">
            Open Draft
          </Button>
        </div>
      </div>
    </Modal>
  )
}
