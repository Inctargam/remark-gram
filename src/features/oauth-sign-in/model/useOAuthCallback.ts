'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { ROUTES } from '@/shared/config'

import { exchangeOAuthCode } from '../api/oauthApi'
import type { OAuthExchangePayload, OAuthProvider } from './types'

type Params = {
  code: string | null
  state: string | null
  oauthError: string | null
  provider: OAuthProvider
}

const PROVIDER_LABELS = {
  github: 'GitHub',
  google: 'Google',
} as const

const getInitialSignInError = ({
  code,
  oauthError,
  provider,
}: Pick<Params, 'code' | 'oauthError' | 'provider'>) => {
  if (oauthError) {
    return oauthError
  }

  if (!code) {
    return `${PROVIDER_LABELS[provider]} OAuth code is missing.`
  }

  return null
}

export const useOAuthCallback = ({ code, oauthError, provider, state }: Params) => {
  const router = useRouter()
  const hasSubmittedRef = useRef(false)
  const [signInError, setSignInError] = useState<string | null>(() =>
    getInitialSignInError({ code, oauthError, provider })
  )

  const exchangeMutation = useMutation({
    mutationFn: (payload: OAuthExchangePayload) => exchangeOAuthCode(provider, payload),
    onError: (error) => {
      setSignInError(
        error instanceof Error
          ? error.message
          : `${PROVIDER_LABELS[provider]} OAuth sign in failed.`
      )
    },
    onSuccess: () => {
      router.replace(ROUTES.home)
    },
  })

  useEffect(() => {
    if (signInError) {
      router.replace(ROUTES.signIn)

      return
    }

    if (hasSubmittedRef.current || !code) {
      return
    }

    hasSubmittedRef.current = true
    exchangeMutation.mutate({ code, state: state ?? undefined })
  }, [code, exchangeMutation, router, signInError, state])
}
