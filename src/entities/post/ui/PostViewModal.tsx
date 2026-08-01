'use client'

import { Dialog } from '@base-ui/react/dialog'
import type { ReactNode } from 'react'

import { Icon } from '@/shared/ui/icon'

import type { Post } from '../model/types'
import { PostView } from './PostView'
import styles from './postViewModal.module.css'

type Props = {
  /** `null` keeps the modal closed — the caller stores the selected post, not a flag. */
  post: Post | null
  open: boolean
  onOpenChange: (open: boolean) => void
  actions?: ReactNode
  /** Set while a dialog opened from the post is on screen, so a click outside keeps the post. */
  disablePointerDismissal?: boolean
}

/**
 * Post view as an overlay over the profile page. No route of its own on purpose:
 * after saving or cancelling an edit the user must stay on the post, and after deleting it
 * must land back on the profile — a modal gives all three without extra navigation.
 *
 * Built on `Dialog` instead of `shared/ui/modal`: the design has no title bar here and puts
 * the close button outside the popup. `Modal` is the "dialog with a header" of the UI kit
 * (the edit-post screen does use it) and turning that header into a set of flags would
 * complicate every existing caller.
 */
export const PostViewModal = ({
  post,
  open,
  onOpenChange,
  actions,
  disablePointerDismissal = false,
}: Props) => {
  if (!post) {
    return null
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
      disablePointerDismissal={disablePointerDismissal}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.popup} aria-label="Publication">
          <Dialog.Close className={styles.close} aria-label="Close">
            <Icon iconId="icon-close-outline" width={24} height={24} />
          </Dialog.Close>
          <PostView post={post} actions={actions} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
