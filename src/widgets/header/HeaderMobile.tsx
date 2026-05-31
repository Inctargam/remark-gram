'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

import { ROUTES } from '@/shared/config/routes'
import { Icon } from '@/shared/ui/icon'

import styles from './headerMobile.module.css'

export type HeaderMobileProps = {
  languageSelector?: ReactNode
  onMenuClick?: () => void
}

export const HeaderMobile = ({ languageSelector, onMenuClick }: HeaderMobileProps) => (
  <header className={styles.header}>
    <Link className={styles.logo} href={ROUTES.home}>
      remarkgram
    </Link>

    <div className={styles.controls}>
      {languageSelector}
      <button
        aria-label="Open menu"
        className={styles.menuButton}
        type="button"
        onClick={onMenuClick}>
        <Icon iconId="icon-more-horizontal-outline" />
      </button>
    </div>
  </header>
)
