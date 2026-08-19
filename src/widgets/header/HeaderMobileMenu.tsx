'use client'

import { useRouter } from 'next/navigation'

import { ROUTES } from '@/shared/config'
import { DropdownMenu } from '@/shared/ui/dropdown-menu'
import { Icon } from '@/shared/ui/icon'

import styles from './headerMobileMenu.module.css'

type Props = {
  onLogout: () => Promise<void>
}

export const HeaderMobileMenu = ({ onLogout }: Props) => {
  const router = useRouter()

  const logoutHandler = async () => {
    await onLogout()
    router.push(ROUTES.signIn)
  }

  return (
    <DropdownMenu
      ariaLabel="Open menu"
      className={styles.menu}
      items={[
        {
          id: 'profile-settings',
          label: 'Profile Settings',
          iconId: 'icon-person-outline',
          onSelect: () => router.push(ROUTES.settings),
        },
        {
          id: 'statistics',
          label: 'Statistics',
          iconId: 'icon-trending-up-outline',
          onSelect: () => router.push(ROUTES.statistics),
        },
        {
          id: 'favorites',
          label: 'Favorites',
          iconId: 'icon-bookmark-outline',
          onSelect: () => router.push(ROUTES.favorites),
        },
        {
          id: 'logout',
          label: 'Log Out',
          iconId: 'icon-log-out-outline',
          onSelect: () => void logoutHandler(),
        },
      ]}
      sideOffset={12}
      trigger={<Icon iconId="icon-more-horizontal-outline" />}
      triggerClassName={styles.trigger}
    />
  )
}
