'use client'

import { ConfirmDialog } from '@/shared/ui/confirm-dialog'

/** Wording comes from the UC-2 alternative scenario, kept verbatim. */
export const DISCARD_CHANGES_MESSAGE =
  'Do you really want to finish editing? If you close the changes you have made will not be saved'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** `Yes` — leave the form without saving. `No` and the close icon just return to the form. */
  onDiscard: () => void
}

export const DiscardChangesDialog = ({ open, onOpenChange, onDiscard }: Props) => (
  <ConfirmDialog
    open={open}
    onOpenChange={onOpenChange}
    title="Close Post"
    message={DISCARD_CHANGES_MESSAGE}
    onConfirm={onDiscard}
  />
)
