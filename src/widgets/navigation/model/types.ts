export type NavItemId =
  | 'home'
  | 'create'
  | 'profile'
  | 'messenger'
  | 'search'
  | 'statistics'
  | 'favorites'

export type NavItem = {
  id: NavItemId
  label: string
  href: string
  /** Icon id when the item is inactive (default state). */
  icon: string
  /** Icon id when the item is active. Falls back to `icon` if omitted. */
  activeIcon?: string
  disabled?: boolean
}
