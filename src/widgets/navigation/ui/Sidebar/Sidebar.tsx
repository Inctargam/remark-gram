'use client'

import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { NAV_ITEMS } from '../../config/nav-items'
import { isPathActive } from '../../lib/is-path-active'
import { NavLink } from '../NavLink/NavLink'
import styles from './Sidebar.module.css'

type Props = {
  /** Content rendered at the bottom of the sidebar (e.g. LogoutButton). */
  footer?: ReactNode
  className?: string
}

export const Sidebar = ({ footer, className }: Props) => {
  const pathname = usePathname()

  return (
    <nav aria-label="Primary navigation" className={clsx(styles.root, className)}>
      <div className={styles.navList}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.id}
            className={styles.navItem}
            isActive={isPathActive(pathname, item.href)}
            item={item}
          />
        ))}
      </div>

      {footer && <div className={styles.footer}>{footer}</div>}
    </nav>
  )
}
