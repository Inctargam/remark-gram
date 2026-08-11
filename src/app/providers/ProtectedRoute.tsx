'use client'

import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { getCurrentUserId, useSessionStatus } from '@/shared/auth'
import { ROUTES } from '@/shared/config'

type Props = {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
  const pathname = usePathname()
  const router = useRouter()
  const sessionStatus = useSessionStatus()
  const isProfileEntry = pathname === ROUTES.profile

  useEffect(() => {
    if (sessionStatus === 'guest') {
      router.replace(isProfileEntry ? ROUTES.home : ROUTES.signIn)
    }

    if (sessionStatus === 'authenticated' && isProfileEntry) {
      router.replace(ROUTES.profileById(getCurrentUserId()))
    }
  }, [isProfileEntry, router, sessionStatus])

  const canRenderProtectedContent = sessionStatus === 'authenticated' && !isProfileEntry

  return canRenderProtectedContent ? children : null
}
