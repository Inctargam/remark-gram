'use client'

import { useRouter } from 'next/navigation'

import { ROUTES } from '@/shared/config/routes'
import { Icon } from '@/shared/ui/icon'

import styles from './LogoutButton.module.css'

type Props = {
  /** Called before redirecting — can be async (e.g. an RTK Query mutation trigger). */
  onLogout?: () => Promise<void> | void
}

export const LogoutButton = ({ onLogout }: Props) => {
  const router = useRouter()

  const clickHandler = async () => {
    await onLogout?.()
    router.push(ROUTES.signIn)
  }

  return (
    <button className={styles.root} type="button" onClick={clickHandler}>
      <Icon className={styles.icon} iconId="icon-log-out-outline" width={24} height={24} />
      <span>Log Out</span>
    </button>
  )
}
