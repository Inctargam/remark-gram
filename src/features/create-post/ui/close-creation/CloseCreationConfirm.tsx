import { Button } from '@/shared/ui/button'
import { Modal } from '@/shared/ui/modal'

import styles from '../createPost.module.css'

type Props = {
  open: boolean
  onDiscard: () => void
  onOpenChange: (open: boolean) => void
  onSaveDraft: () => void
}

export const CloseCreationConfirm = ({ open, onDiscard, onOpenChange, onSaveDraft }: Props) => (
  <Modal
    className={styles.closeConfirmModal}
    open={open}
    onOpenChange={onOpenChange}
    title="Close"
    disablePointerDismissal>
    <div className={styles.closeConfirmContent}>
      <p className={styles.closeConfirmText}>
        Do you really want to close the creation of a publication? You can save changes in a draft
        for this session or discard them.
      </p>

      <div className={styles.closeConfirmActions}>
        <Button type="button" variant="outline" onClick={onDiscard}>
          Discard
        </Button>
        <Button type="button" onClick={onSaveDraft}>
          Save draft
        </Button>
      </div>
    </div>
  </Modal>
)
