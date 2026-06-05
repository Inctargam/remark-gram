import { Button } from '@/shared/ui/button'
import { Modal } from '@/shared/ui/modal'

import styles from './LogoutModal.module.css'

type Props = {
  open: boolean
  email: string
  onConfirm: () => void
  onCancel: () => void
}

export const LogoutModal = ({ open, email, onConfirm, onCancel }: Props) => (
  <Modal
    open={open}
    onOpenChange={open => !open && onCancel()}
    disablePointerDismissal
    title="Log Out"
  >
    <p className={styles.text}>
      Are you really want to log out of your account{' '}
      <strong>"{email}"</strong>?
    </p>
    <div className={styles.actions}>
      <Button variant="outline" onClick={onConfirm}>
        Yes
      </Button>
      <Button variant="primary" onClick={onCancel}>
        No
      </Button>
    </div>
  </Modal>
)