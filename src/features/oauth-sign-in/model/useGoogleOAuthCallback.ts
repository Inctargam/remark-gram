'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { ROUTES } from '@/shared/config'

import { signInWithGoogleCode } from '../api/googleOAuthApi'
import type { GoogleOAuthSignInPayload } from './types'

type Params = {
  code: string | null
  state: string | null
  oauthError: string | null
}

const getInitialSignInError = ({ code, oauthError }: Pick<Params, 'code' | 'oauthError'>) => {
  if (oauthError) {
    return oauthError
  }

  if (!code) {
    return 'Google OAuth code is missing.'
  }

  return null
}

export const useGoogleOAuthCallback = ({ code, oauthError, state }: Params) => {
  const router = useRouter()
  const hasSubmittedRef = useRef(false)
  const [signInError, setSignInError] = useState<string | null>(() =>
    getInitialSignInError({ code, oauthError })
  )

  const exchangeMutation = useMutation({
    mutationFn: (payload: GoogleOAuthSignInPayload) => signInWithGoogleCode(payload),
    onError: (error) => {
      setSignInError(error instanceof Error ? error.message : 'Google OAuth sign in failed.')
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
