'use client'

import { useState } from 'react'

import type { Post } from '@/entities/post'
import { PostAuthor, PostDescriptionField, PostGallery } from '@/entities/post'
import { Button } from '@/shared/ui/button'
import { Modal } from '@/shared/ui/modal'

import { useUpdatePostMutation } from '../api/useUpdatePostMutation'
import { preparePostDescription } from '../model/editPostDescription'
import { useEditPostForm } from '../model/useEditPostForm'
import { DiscardChangesDialog } from './DiscardChangesDialog'
import styles from './editPostModal.module.css'

type Props = {
  post: Post
  open: boolean
  /** Called with `false` once the form may really close — after saving or after discarding. */
  onOpenChange: (open: boolean) => void
}

const SAVE_ERROR_MESSAGE = 'Failed to save changes. Please try again.'

export const EditPostModal = ({ post, open, onOpenChange }: Props) => {
  const { canSave, description, descriptionChangeHandler, isDirty } = useEditPostForm(
    post.description
  )
  const [isDiscardOpen, setIsDiscardOpen] = useState(false)
  const { error, isPending, mutate } = useUpdatePostMutation(post)

  // Every dismissal path (close icon, Escape, click outside) lands here. With no changes the
  // form closes straight away — the spec calls that out explicitly.
  const closeRequestHandler = () => {
    if (isDirty) {
      setIsDiscardOpen(true)

      return
    }

    onOpenChange(false)
  }

  const openChangeHandler = (nextOpen: boolean) => {
    if (!nextOpen) {
      closeRequestHandler()
    }
  }

  const saveHandler = () => {
    mutate(preparePostDescription(description), { onSuccess: () => onOpenChange(false) })
  }

  const discardHandler = () => {
    onOpenChange(false)
  }

  return (
    <>
      <Modal
        className={styles.modal}
        bodyClassName={styles.body}
        open={open}
        onOpenChange={openChangeHandler}
        title="Edit Post"
        // While the confirmation is on screen the form must not react to clicks outside it.
        disablePointerDismissal={isDiscardOpen}>
        <div className={styles.content}>
          {/* Keyed by post: a different publication must start from its first photo. */}
          <PostGallery post={post} key={post.id} />

          <div className={styles.form}>
            <PostAuthor className={styles.author} post={post} />

            <PostDescriptionField
              className={styles.descriptionField}
              label="Add publication descriptions"
              value={description}
              disabled={isPending}
              onChange={descriptionChangeHandler}
            />

            {error ? (
              <p className={styles.error} role="alert">
                {SAVE_ERROR_MESSAGE}
              </p>
            ) : null}

            <div className={styles.actions}>
              <Button type="button" disabled={!canSave || isPending} onClick={saveHandler}>
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <DiscardChangesDialog
        open={isDiscardOpen}
        onOpenChange={setIsDiscardOpen}
        onDiscard={discardHandler}
      />
    </>
  )
}
