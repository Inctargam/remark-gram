'use client'

import { useState } from 'react'

import { OAUTH_CONFIG } from '@/shared/config'

import type { OAuthProvider } from './types'

export const useOAuthSignIn = () => {
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(null)

  const signInWithOAuth = (provider: OAuthProvider) => {
    if (provider !== 'google') {
      return
    }

    setPendingProvider('google')
    window.location.assign(OAUTH_CONFIG.googleMockAuthorizeEndpoint)
  }

  return {
    pendingProvider,
    signInWithOAuth,
  }
}
