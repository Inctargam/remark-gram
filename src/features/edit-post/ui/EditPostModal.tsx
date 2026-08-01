'use client'

import Image from 'next/image'
import type { ChangeEvent } from 'react'
import { useState } from 'react'

import type { Post } from '@/entities/post'
import { POST_DESCRIPTION_MAX_LENGTH, PostGallery } from '@/entities/post'
import { Button } from '@/shared/ui/button'
import { Modal } from '@/shared/ui/modal'
import { TextArea } from '@/shared/ui/textarea'

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

  const textAreaChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    descriptionChangeHandler(event.currentTarget.value)
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
          <PostGallery post={post} />

          <div className={styles.form}>
            <div className={styles.author}>
              <span className={styles.avatar}>
                {post.ownerAvatarUrl ? (
                  <Image
                    className={styles.avatarImage}
                    src={post.ownerAvatarUrl}
                    alt=""
                    fill
                    sizes="36px"
                    unoptimized
                  />
                ) : null}
              </span>
              <span className={styles.username}>{post.ownerUsername}</span>
            </div>

            <TextArea
              className={styles.descriptionField}
              label="Add publication descriptions"
              maxLength={POST_DESCRIPTION_MAX_LENGTH}
              placeholder="Add publication description"
              value={description}
              disabled={isPending}
              onChange={textAreaChangeHandler}
            />
            <p className={styles.counter}>
              {description.length}/{POST_DESCRIPTION_MAX_LENGTH}
            </p>

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
