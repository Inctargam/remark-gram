'use client'

import type { Post } from '@/entities/post'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'

import { useDeletePostMutation } from '../api/useDeletePostMutation'
import styles from './deletePostDialog.module.css'

/** Wording of the UC-3 confirmation, matching the `Delete Post` frame of the design. */
export const DELETE_POST_TITLE = 'Delete Post'
export const DELETE_POST_MESSAGE = 'Are you sure you want to delete this post?'
const DELETE_ERROR_MESSAGE = 'Failed to delete the post. Please try again.'

type Props = {
  post: Post
  open: boolean
  /** `No`, the close icon and a finished deletion all close the confirmation. */
  onOpenChange: (open: boolean) => void
  /** Called once the post is gone — the caller closes the post view and stays on the profile. */
  onDeleted: () => void
}

export const DeletePostDialog = ({ post, open, onOpenChange, onDeleted }: Props) => {
  const { error, isPending, mutate } = useDeletePostMutation(post)

  const confirmHandler = () => {
    mutate(undefined, {
      onSuccess: () => {
        onOpenChange(false)
        onDeleted()
      },
    })
  }

  // While the request is in flight the confirmation stays put, otherwise a failed
  // deletion would have nowhere to be reported.
  const openChangeHandler = (nextOpen: boolean) => {
    if (!nextOpen && isPending) {
      return
    }

    onOpenChange(nextOpen)
  }

  const message = error ? (
    <>
      {DELETE_POST_MESSAGE}
      <span className={styles.error} role="alert">
        {DELETE_ERROR_MESSAGE}
      </span>
    </>
  ) : (
    DELETE_POST_MESSAGE
  )

  return (
    <ConfirmDialog
      className={styles.dialog}
      open={open}
      onOpenChange={openChangeHandler}
      title={DELETE_POST_TITLE}
      message={message}
      confirmDisabled={isPending}
      // The deletion is asynchronous: the dialog closes in `onSuccess`, not on the click.
      closeOnConfirm={false}
      onConfirm={confirmHandler}
    />
  )
}
