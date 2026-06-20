import Link from 'next/link'

import { Icon } from '@/shared/ui/icon'

import type { NavItem } from '../../model/types'
import styles from './NavLink.module.css'

type Props = {
  item: NavItem
  isActive: boolean
  /** Extra classes applied to the root element — used by shells to inject layout styles. */
  className?: string
  labelClassName?: string
}

export const NavLink = ({ item, isActive, className, labelClassName }: Props) => {
  const { label, href, icon, activeIcon, disabled } = item
  const iconId = isActive && activeIcon ? activeIcon : icon

  const content = (
    <>
      <Icon className={styles.icon} iconId={iconId} width={24} height={24} />
      <span className={labelClassName ?? styles.label}>{label}</span>
    </>
  )

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={[styles.item, styles.disabled, className].filter(Boolean).join(' ')}>
        {content}
      </span>
    )
  }

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={[styles.item, isActive && styles.active, className].filter(Boolean).join(' ')}
      href={href}>
      {content}
    </Link>
  )
}
