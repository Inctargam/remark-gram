'use client'

import { useRef } from 'react'

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
  // A ref, not `isPending`: `ConfirmDialog` asks to close in the same tick as the click,
  // before React has re-rendered with the pending state.
  const isDeletingRef = useRef(false)

  const confirmHandler = () => {
    isDeletingRef.current = true

    mutate(undefined, {
      onSuccess: () => {
        isDeletingRef.current = false
        onOpenChange(false)
        onDeleted()
      },
      onError: () => {
        isDeletingRef.current = false
      },
    })
  }

  // The confirmation must survive its own `Yes` until the request resolves, otherwise a
  // failed deletion would have nowhere to be reported.
  const openChangeHandler = (nextOpen: boolean) => {
    if (!nextOpen && isDeletingRef.current) {
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
      onConfirm={confirmHandler}
    />
  )
}
