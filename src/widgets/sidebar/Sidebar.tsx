'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Icon } from '@/shared/ui/icon'

import styles from './sidebar.module.css'

export type SidebarItemId =
  | 'home'
  | 'create'
  | 'profile'
  | 'messenger'
  | 'search'
  | 'statistics'
  | 'favorites'

export type SidebarItem = {
  id: SidebarItemId
  label: string
  href: string
  icon: string
  activeIcon?: string
  disabled?: boolean
}

export type SidebarProps = {
  currentPathname?: string
  items?: SidebarItem[]
  className?: string
  onNavigate?: (item: SidebarItemId) => void
  onLogout?: () => void
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'home', label: 'Home', href: '/', icon: 'icon-home-outline', activeIcon: 'icon-home' },
  {
    id: 'create',
    label: 'Create',
    href: '/create',
    icon: 'icon-plus-square-outline',
    activeIcon: 'icon-plus-square',
  },
  {
    id: 'profile',
    label: 'My Profile',
    href: '/profile',
    icon: 'icon-person-outline',
    activeIcon: 'icon-person',
  },
  {
    id: 'messenger',
    label: 'Messenger',
    href: '/messenger',
    icon: 'icon-message-circle-outline',
    activeIcon: 'icon-message-circle',
  },
  {
    id: 'search',
    label: 'Search',
    href: '/search',
    icon: 'icon-search-outline',
    activeIcon: 'icon-search',
  },
  {
    id: 'statistics',
    label: 'Statistics',
    href: '/statistics',
    icon: 'icon-trending-up-outline',
    activeIcon: 'icon-trending-up',
  },
  {
    id: 'favorites',
    label: 'Favorites',
    href: '/favorites',
    icon: 'icon-bookmark-outline',
    activeIcon: 'icon-bookmark',
  },
]

const isPathActive = (pathname: string, href: string) => {
  if (href === '/') {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export const Sidebar = ({
  currentPathname,
  items = SIDEBAR_ITEMS,
  className,
  onNavigate,
  onLogout,
}: SidebarProps) => {
  const pathname = usePathname()
  const activePathname = currentPathname ?? pathname ?? undefined

  return (
    <nav className={clsx(styles.root, className)} aria-label="Primary navigation">
      <div className={styles.navList}>
        {items.map(({ id, label, href, icon, activeIcon, disabled }) => {
          const isActive = activePathname ? isPathActive(activePathname, href) : false
          const content = (
            <>
              <Icon
                className={styles.icon}
                iconId={isActive && activeIcon ? activeIcon : icon}
                height={24}
                width={24}
              />
              <span className={styles.label}>{label}</span>
            </>
          )

          if (disabled) {
            return (
              <span key={id} aria-disabled="true" className={clsx(styles.item, styles.disabled)}>
                {content}
              </span>
            )
          }

          return (
            <Link
              key={id}
              aria-current={isActive ? 'page' : undefined}
              className={clsx(styles.item, isActive && styles.active)}
              href={href}
              onClick={() => onNavigate?.(id)}>
              {content}
            </Link>
          )
        })}
      </div>

      <button className={styles.logout} onClick={onLogout} type="button">
        <Icon className={styles.icon} height={24} iconId="icon-log-out-outline" width={24} />
        <span className={styles.label}>Log Out</span>
      </button>
    </nav>
  )
}
