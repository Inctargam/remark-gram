'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { useConfirmRegistrationMutation } from '../api/useConfirmRegistrationMutation'
import { useResendRegistrationConfirmationMutation } from '../api/useResendRegistrationConfirmationMutation'
import { ConfirmEmailView } from './ConfirmEmailView'

export const ConfirmEmailPage = () => {
  const searchParams = useSearchParams()
  const code = searchParams?.get('code') ?? ''

  const [resendEmail, setResendEmail] = useState('')
  const [resendError, setResendError] = useState('')
  const [isResendModalOpen, setIsResendModalOpen] = useState(false)
  const submittedCodeRef = useRef<string | null>(null)

  const {
    isIdle: isConfirmationIdle,
    isPending: isConfirmationPending,
    isSuccess: isConfirmationSuccess,
    mutate: confirmRegistration,
  } = useConfirmRegistrationMutation()

  const { isPending: isResendPending, mutate: resendRegistrationConfirmation } =
    useResendRegistrationConfirmationMutation()

  useEffect(() => {
    if (!code || submittedCodeRef.current === code) {
      return
    }

    submittedCodeRef.current = code
    confirmRegistration({ code })
  }, [code, confirmRegistration])

  const resendHandler = () => {
    if (!resendEmail) {
      setResendError('Email is required')
      return
    }
    setResendError('')
    resendRegistrationConfirmation(
      { email: resendEmail },
      {
        onSuccess: () => setIsResendModalOpen(true),
        onError: (error) => {
          // TODO(api-error-middleware): Replace with the centralized API error type.
          if (error instanceof Error) {
            setResendError(error.message)
          }
        },
      }
    )
  }

  const isConfirmationLoading = isConfirmationIdle || isConfirmationPending
  const status =
    !code || isConfirmationLoading ? 'loading' : isConfirmationSuccess ? 'success' : 'expired'

  return (
    <ConfirmEmailView
      status={status}
      resendEmail={resendEmail}
      resendError={resendError}
      isResendPending={isResendPending}
      isResendModalOpen={isResendModalOpen}
      onResendEmailChange={setResendEmail}
      onResend={resendHandler}
      onResendModalOpenChange={setIsResendModalOpen}
    />
  )
}
