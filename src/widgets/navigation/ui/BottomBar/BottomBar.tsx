'use client'

import clsx from 'clsx'
import { usePathname } from 'next/navigation'

import { BOTTOM_BAR_ITEMS } from '../../config/nav-items'
import { isPathActive } from '../../lib/is-path-active'
import { NavLink } from '../NavLink/NavLink'
import styles from './BottomBar.module.css'

type Props = {
  className?: string
}

export const BottomBar = ({ className }: Props) => {
  const pathname = usePathname()

  return (
    <nav aria-label="Mobile navigation" className={clsx(styles.root, className)}>
      {BOTTOM_BAR_ITEMS.map(item => (
        <NavLink
          key={item.id}
          className={styles.navItem}
          isActive={isPathActive(pathname, item.href)}
          item={item}
          labelClassName={styles.srOnly}
        />
      ))}
    </nav>
  )
}
