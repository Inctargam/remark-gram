import { Button } from '@/shared/ui/button'
import { Icon } from '@/shared/ui/icon'
import { Modal } from '@/shared/ui/modal'

import styles from './createPostPage.module.css'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CreatePostModal = ({ open, onOpenChange }: Props) => (
  <Modal className={styles.modal} open={open} onOpenChange={onOpenChange} title="Add Photo">
    <div className={styles.content}>
      <div className={styles.placeholder} aria-hidden="true">
        <Icon
          className={styles.placeholderIcon}
          iconId="icon-image-outline"
          width={48}
          height={48}
        />
      </div>

      <div className={styles.actions}>
        <Button type="button">Select from Computer</Button>
        <Button className={styles.openDraftButton} type="button" variant="outline">
          Open Draft
        </Button>
      </div>
    </div>
  </Modal>
)
