import { Icon } from '@/shared/ui/icon'

import styles from './navigationMenu.module.css'

export type NavItem = 'home' | 'create' | 'profile' | 'search' | 'messenger'

type NavItemConfig = {
  id: NavItem
  activeIcon: string
  inactiveIcon: string
  label: string
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'home', activeIcon: 'icon-home', inactiveIcon: 'icon-home-outline', label: 'Home' },
  {
    id: 'create',
    activeIcon: 'icon-plus-square',
    inactiveIcon: 'icon-plus-square-outline',
    label: 'Create',
  },
  {
    id: 'profile',
    activeIcon: 'icon-person',
    inactiveIcon: 'icon-person-outline',
    label: 'Profile',
  },
  { id: 'search', activeIcon: 'icon-search', inactiveIcon: 'icon-search-outline', label: 'Search' },
  {
    id: 'messenger',
    activeIcon: 'icon-message-circle',
    inactiveIcon: 'icon-message-circle-outline',
    label: 'Messenger',
  },
]

export type NavigationMenuProps = {
  activeItem: NavItem
  onNavigate: (item: NavItem) => void
}

export const NavigationMenu = ({ activeItem, onNavigate }: NavigationMenuProps) => (
  <nav className={styles.nav}>
    {NAV_ITEMS.map(({ id, activeIcon, inactiveIcon, label }) => {
      const isActive = activeItem === id
      return (
        <button
          key={id}
          className={styles.item}
          onClick={() => onNavigate(id)}
          aria-label={label}
          aria-current={isActive ? 'page' : undefined}>
          <Icon
            iconId={isActive ? activeIcon : inactiveIcon}
            className={isActive ? styles.iconActive : styles.iconInactive}
          />
        </button>
      )
    })}
  </nav>
)
