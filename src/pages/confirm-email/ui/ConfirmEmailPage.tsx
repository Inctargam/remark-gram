'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { api, ApiError } from '@/shared/api/baseApi'

import { ConfirmEmailView } from './ConfirmEmailView'

export const ConfirmEmailPage = () => {
  const searchParams = useSearchParams()
  const code = searchParams?.get('code') ?? ''

  const [resendEmail, setResendEmail] = useState('')
  const [resendError, setResendError] = useState('')

  const { isLoading, isSuccess } = useQuery({
    queryKey: ['confirm-email', code],
    queryFn: () => api.get(`/v1/auth/registration-confirmation?code=${encodeURIComponent(code)}`),
    enabled: Boolean(code),
    retry: false,
  })

  const resendMutation = useMutation({
    mutationFn: (email: string) =>
      api.post('/v1/auth/resend-registration-email', {
        email,
        baseUrl: window.location.origin,
      }),
    onError: (error) => {
      if (error instanceof ApiError && error.data) {
        setResendError(error.data.message)
      }
    },
  })

  const resendHandler = () => {
    if (!resendEmail) {
      setResendError('Email is required')
      return
    }
    setResendError('')
    resendMutation.mutate(resendEmail)
  }

  const status = !code || isLoading ? 'loading' : isSuccess ? 'success' : 'expired'

  return (
    <ConfirmEmailView
      status={status}
      resendEmail={resendEmail}
      resendError={resendError}
      isResendPending={resendMutation.isPending}
      isResendSuccess={resendMutation.isSuccess}
      onResendEmailChange={setResendEmail}
      onResend={resendHandler}
    />
  )
}
