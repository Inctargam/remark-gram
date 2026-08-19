import Link from 'next/link'

import { ROUTES } from '@/shared/config'
import { Icon } from '@/shared/ui/icon'

import styles from './settingsPage.module.css'

export const SettingsMobileHeader = () => (
  <div className={styles.mobileHeader}>
    <Link aria-label="Back to profile" className={styles.backLink} href={ROUTES.profile}>
      <Icon iconId="icon-arrow-back-outline" />
    </Link>
    <h1 className={styles.mobileTitle}>Profile Settings</h1>
  </div>
)
