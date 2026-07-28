import type { ChangeEvent } from 'react'
import { useRef } from 'react'

import { Button } from '@/shared/ui/button'
import { Icon } from '@/shared/ui/icon'

import styles from './createPost.module.css'

type Props = {
  hasDraft: boolean
  uploadError: string | null
  onDraftOpen: () => void
  onPhotosSelect: (files: File[]) => void
}

export const AddPhotoStep = ({ hasDraft, uploadError, onDraftOpen, onPhotosSelect }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectFromComputerHandler = () => {
    fileInputRef.current?.click()
  }

  const fileChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.currentTarget.files ?? [])

    onPhotosSelect(selectedFiles)
    event.currentTarget.value = ''
  }

  return (
    <div className={styles.addPhotoContent}>
      <input
        ref={fileInputRef}
        className={styles.fileInput}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        onChange={fileChangeHandler}
      />

      <div className={styles.placeholder} aria-hidden="true">
        <Icon
          className={styles.placeholderIcon}
          iconId="icon-image-outline"
          width={48}
          height={48}
        />
      </div>

      {uploadError && (
        <p className={styles.uploadError} role="alert">
          {uploadError}
        </p>
      )}

      <div className={styles.actions}>
        <Button type="button" onClick={selectFromComputerHandler}>
          Select from Computer
        </Button>
        <Button
          className={styles.openDraftButton}
          type="button"
          variant="outline"
          disabled={!hasDraft}
          onClick={onDraftOpen}>
          Open Draft
        </Button>
      </div>
    </div>
  )
}
