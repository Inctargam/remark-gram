import type { ChangeEvent } from 'react'
import { useRef } from 'react'
import Cropper, { type Area, type Point } from 'react-easy-crop'

import { JPEG_PNG_IMAGE_ACCEPT } from '@/shared/lib/image-file'
import { Alert } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { Icon } from '@/shared/ui/icon'
import { Modal } from '@/shared/ui/modal'

import { MAX_PROFILE_AVATAR_ZOOM, MIN_PROFILE_AVATAR_ZOOM } from '../model/profileAvatarCrop'
import styles from './manageProfileAvatar.module.css'

type Props = {
  crop: Point
  error: string | null
  isSaving: boolean
  open: boolean
  previewUrl: string | null
  zoom: number
  onCropChange: (crop: Point) => void
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void
  onFileSelect: (file: File | undefined) => void
  onOpenChange: (open: boolean) => void
  onSave: () => void
  onZoomChange: (zoom: number) => void
}

export const AddProfileAvatarModal = ({
  crop,
  error,
  isSaving,
  open,
  previewUrl,
  zoom,
  onCropChange,
  onCropComplete,
  onFileSelect,
  onOpenChange,
  onSave,
  onZoomChange,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectFromComputerHandler = () => {
    fileInputRef.current?.click()
  }

  const fileChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    onFileSelect(event.currentTarget.files?.[0])
    event.currentTarget.value = ''
  }

  return (
    <Modal
      bodyClassName={styles.addModalBody}
      className={styles.addModal}
      dismissDisabled={isSaving}
      open={open}
      title="Add a Profile Photo"
      onOpenChange={onOpenChange}>
      <input
        ref={fileInputRef}
        accept={JPEG_PNG_IMAGE_ACCEPT}
        aria-label="Profile photo file"
        className={styles.fileInput}
        type="file"
        onChange={fileChangeHandler}
      />

      {error && (
        <Alert className={styles.errorAlert} variant="error">
          <>
            <b>Error!</b> {error}
          </>
        </Alert>
      )}

      {previewUrl ? (
        <div className={styles.cropContent}>
          <div className={styles.cropperFrame} aria-label="Profile photo crop area" role="group">
            <Cropper
              aspect={1}
              crop={crop}
              cropShape="round"
              image={previewUrl}
              maxZoom={MAX_PROFILE_AVATAR_ZOOM}
              minZoom={MIN_PROFILE_AVATAR_ZOOM}
              showGrid={false}
              zoom={zoom}
              onCropChange={onCropChange}
              onCropComplete={onCropComplete}
              onZoomChange={onZoomChange}
            />
          </div>

          <div className={styles.saveAction}>
            <Button disabled={isSaving} type="button" onClick={onSave}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.selectContent}>
          <div className={styles.avatarPlaceholder} aria-hidden="true">
            <Icon iconId="icon-image-outline" width={48} height={48} />
          </div>

          <Button type="button" onClick={selectFromComputerHandler}>
            Select from Computer
          </Button>
        </div>
      )}
    </Modal>
  )
}
