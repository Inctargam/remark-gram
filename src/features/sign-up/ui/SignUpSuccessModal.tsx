'use client'

import { Button } from '@/shared/ui/button'
import { Modal } from '@/shared/ui/modal'

type Props = {
  open: boolean
  email: string
  onClose: () => void
}

export const SignUpSuccessModal = ({ open, email, onClose }: Props) => (
  <Modal
    open={open}
    onOpenChange={(isOpen) => !isOpen && onClose()}
    title="Email sent"
    disablePointerDismissal>
    <p>We have sent a link to confirm your email to {email}</p>
    <Button type="button" variant="primary" onClick={onClose}>
      OK
    </Button>
  </Modal>
)
