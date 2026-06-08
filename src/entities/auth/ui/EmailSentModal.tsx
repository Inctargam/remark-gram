import { Button } from '@/shared/ui/button'
import { Modal } from '@/shared/ui/modal'

import styles from './EmailSentModal.module.css'

type Props = {
  email?: string | null
  onOpenChange: (open: boolean) => void
  open: boolean
}

export const EmailSentModal = ({ email, onOpenChange, open }: Props) => (
  <Modal open={open} onOpenChange={onOpenChange} title="Email sent">
    <p className={styles.text}>We have sent a link to confirm your email to {email}</p>
    <div className={styles.actions}>
      <Button onClick={() => onOpenChange(false)} type="button">
        OK
      </Button>
    </div>
  </Modal>
)
