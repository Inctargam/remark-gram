import { ROUTES } from '@/shared/config'

import type { NavItem, NavItemId } from '../model/types'

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: ROUTES.home,
    icon: 'icon-home-outline',
    activeIcon: 'icon-home',
  },
  {
    id: 'create',
    label: 'Create',
    href: ROUTES.create,
    icon: 'icon-plus-square-outline',
    activeIcon: 'icon-plus-square',
  },
  {
    id: 'profile',
    label: 'My Profile',
    href: ROUTES.profile,
    icon: 'icon-person-outline',
    activeIcon: 'icon-person',
  },
  {
    id: 'messenger',
    label: 'Messenger',
    href: ROUTES.messenger,
    icon: 'icon-message-circle-outline',
    activeIcon: 'icon-message-circle',
  },
  {
    id: 'search',
    label: 'Search',
    href: ROUTES.search,
    icon: 'icon-search-outline',
    activeIcon: 'icon-search',
  },
  {
    id: 'statistics',
    label: 'Statistics',
    href: ROUTES.statistics,
    icon: 'icon-trending-up-outline',
    activeIcon: 'icon-trending-up',
  },
  {
    id: 'favorites',
    label: 'Favorites',
    href: ROUTES.favorites,
    icon: 'icon-bookmark-outline',
    activeIcon: 'icon-bookmark',
  },
]

const BOTTOM_BAR_IDS: NavItemId[] = ['home', 'create', 'messenger', 'search', 'profile']

// map по BOTTOM_BAR_IDS, а не filter по NAV_ITEMS — иначе порядок следует NAV_ITEMS,
// а не заданной последовательности для нижней панели.
export const BOTTOM_BAR_ITEMS: NavItem[] = BOTTOM_BAR_IDS.map((id) =>
  NAV_ITEMS.find((item) => item.id === id)
).filter((item): item is NavItem => item !== undefined)
