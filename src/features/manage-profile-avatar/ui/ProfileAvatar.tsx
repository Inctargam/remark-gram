'use client'

import clsx from 'clsx'
import Image from 'next/image'

import { Alert } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { Icon } from '@/shared/ui/icon'

import { useDeleteProfileAvatar } from '../model/useDeleteProfileAvatar'
import { useProfileAvatar } from '../model/useProfileAvatar'
import { useUploadProfileAvatar } from '../model/useUploadProfileAvatar'
import { AddProfileAvatarModal } from './AddProfileAvatarModal'
import styles from './manageProfileAvatar.module.css'

export const ProfileAvatar = () => {
  const avatar = useProfileAvatar()
  const {
    crop,
    isAddModalOpen,
    isSaving,
    previewUrl,
    uploadError,
    zoom,
    addModalOpenChangeHandler,
    addAvatarClickHandler,
    cropCompleteHandler,
    fileSelectHandler,
    saveAvatarHandler,
    setCrop,
    setZoom,
  } = useUploadProfileAvatar()
  const {
    deleteError,
    isDeleteModalOpen,
    isDeleting,
    deleteModalOpenChangeHandler,
    deleteAvatarClickHandler,
    deleteAvatarConfirmHandler,
  } = useDeleteProfileAvatar()
  const selectAvatarButtonLabel = avatar ? 'Select Profile Photo' : 'Add Profile Photo'

  return (
    <div className={styles.avatarColumn}>
      <div className={clsx(styles.avatar, avatar && styles.avatarWithImage)}>
        {avatar ? (
          <Image
            alt=""
            className={styles.avatarImage}
            fill
            sizes="192px"
            src={avatar.url}
            unoptimized
          />
        ) : (
          <Icon iconId="icon-person-outline" width={48} height={48} />
        )}

        {avatar && (
          <button
            aria-label="Delete profile photo"
            className={styles.deleteAvatarButton}
            type="button"
            onClick={deleteAvatarClickHandler}>
            <Icon iconId="icon-close" width={16} height={16} />
          </button>
        )}
      </div>

      <Button
        className={styles.selectAvatarButton}
        type="button"
        variant="outline"
        onClick={addAvatarClickHandler}>
        {selectAvatarButtonLabel}
      </Button>

      <AddProfileAvatarModal
        crop={crop}
        error={uploadError}
        isSaving={isSaving}
        open={isAddModalOpen}
        previewUrl={previewUrl}
        zoom={zoom}
        onCropChange={setCrop}
        onCropComplete={cropCompleteHandler}
        onFileSelect={fileSelectHandler}
        onOpenChange={addModalOpenChangeHandler}
        onSave={saveAvatarHandler}
        onZoomChange={setZoom}
      />

      <ConfirmDialog
        cancelDisabled={isDeleting}
        className={styles.deleteModal}
        closeOnConfirm={false}
        confirmDisabled={isDeleting}
        dismissDisabled={isDeleting}
        error={
          deleteError ? (
            <Alert variant="error">
              <>
                <b>Error!</b> {deleteError}
              </>
            </Alert>
          ) : undefined
        }
        message="Are you sure you want to delete the photo?"
        open={isDeleteModalOpen}
        title="Delete Photo"
        onConfirm={deleteAvatarConfirmHandler}
        onOpenChange={deleteModalOpenChangeHandler}
      />
    </div>
  )
}
