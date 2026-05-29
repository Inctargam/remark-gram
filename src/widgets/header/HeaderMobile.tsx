import { Icon } from '@/shared/ui/icon'

import styles from './headerMobile.module.css'

export type HeaderMobileProps = {
  onMenuClick?: () => void
}

export const HeaderMobile = ({ onMenuClick }: HeaderMobileProps) => (
  <header className={styles.header}>
    <span className={styles.logo}>remarkgram</span>
    <button className={styles.menuButton} onClick={onMenuClick} aria-label="Open menu">
      <Icon iconId="icon-more-horizontal" />
    </button>
  </header>
)
