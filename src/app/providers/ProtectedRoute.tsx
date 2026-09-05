'use client'

import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { useCurrentUser, useSessionStatus } from '@/shared/auth'
import { ROUTES } from '@/shared/config'

type Props = {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
  const pathname = usePathname()
  const router = useRouter()
  const currentUser = useCurrentUser()
  const sessionStatus = useSessionStatus()
  const isProfileEntry = pathname === ROUTES.profile

  useEffect(() => {
    if (sessionStatus === 'guest') {
      router.replace(isProfileEntry ? ROUTES.home : ROUTES.signIn)
    }

    if (sessionStatus === 'authenticated' && isProfileEntry && currentUser) {
      router.replace(ROUTES.profileById(currentUser.id))
    }
  }, [currentUser, isProfileEntry, router, sessionStatus])

  const canRenderProtectedContent = sessionStatus === 'authenticated' && !isProfileEntry

  return canRenderProtectedContent ? children : null
}
