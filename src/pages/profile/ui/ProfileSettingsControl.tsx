'use client'

import Link from 'next/link'

import { useCurrentUser, useSessionStatus } from '@/shared/auth'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/button'

import styles from './profilePage.module.css'

type Props = {
  userId: string
}

export const ProfileSettingsControl = ({ userId }: Props) => {
  const status = useSessionStatus()
  const currentUser = useCurrentUser()

  if (status === 'loading') {
    return (
      <span
        className={styles.settingsSkeleton}
        role="status"
        aria-label="Loading profile settings"
      />
    )
  }

  const isOwner = status === 'authenticated' && currentUser?.id === userId

  if (!isOwner) {
    return null
  }

  return (
    <Button
      className={styles.settingsButton}
      nativeButton={false}
      render={<Link href={ROUTES.settings} />}
      variant="secondary">
      Profile Settings
    </Button>
  )
}
