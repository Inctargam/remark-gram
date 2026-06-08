'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ROUTES } from '@/shared/config'
import { Icon } from '@/shared/ui/icon'

import styles from './LogoutButton.module.css'
import { LogoutModal } from './LogoutModal'

type Props = {
  /**
   * Email текущего пользователя — отображается в тексте модалки подтверждения.
   * Когда будет RTK Query, передавать из useGetMeQuery().
   */
  email?: string
  /** Called before redirecting — can be async (e.g., an RTK Query mutation trigger). */
  onLogout?: () => Promise<void> | void
}

export const LogoutButton = ({ email = '', onLogout }: Props) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const clickHandler = () => {
    setIsOpen(true)
  }

  const confirmHandler = async () => {
    setIsOpen(false)
    await onLogout?.()
    router.push(ROUTES.signIn)
  }

  const cancelHandler = () => {
    setIsOpen(false)
  }

  return (
    <>
      <button className={styles.root} type="button" onClick={clickHandler}>
        <Icon className={styles.icon} iconId="icon-log-out-outline" width={24} height={24} />
        <span>Log Out</span>
      </button>

      <LogoutModal
        open={isOpen}
        email={email}
        onConfirm={confirmHandler}
        onCancel={cancelHandler}
      />
    </>
  )
}
