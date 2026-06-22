'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { RECAPTCHA_SITE_KEY } from '@/shared/config'

export type RecaptchaWidgetState = 'idle' | 'loading' | 'verified' | 'expired' | 'error'

const SCRIPT_URL = 'https://www.google.com/recaptcha/enterprise.js'

export const useRecaptchaWidget = () => {
  const [state, setState] = useState<RecaptchaWidgetState>('idle')
  const [token, setToken] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isVerified = state === 'verified'

  useEffect(() => {
    if (typeof window === 'undefined') return

    const renderWidget = () => {
      const enterprise = window.grecaptcha?.enterprise
      if (!enterprise || !containerRef.current) return

      enterprise.ready(() => {
        if (!containerRef.current) return

        enterprise.render(containerRef.current, {
          sitekey: RECAPTCHA_SITE_KEY,
          theme: 'dark',
          callback: (receivedToken: string) => {
            setToken(receivedToken)
            setState('verified')
          },
          'expired-callback': () => {
            setState('expired')
            setToken(null)
          },
          'error-callback': () => {
            setState('error')
          },
        })
      })
    }

    if (document.querySelector(`script[src^="${SCRIPT_URL}"]`)) {
      if (window.grecaptcha?.enterprise) {
        renderWidget()
        return
      }

      const interval = setInterval(() => {
        if (window.grecaptcha?.enterprise) {
          clearInterval(interval)
          renderWidget()
        }
      }, 100)

      return () => clearInterval(interval)
    }

    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.defer = true

    script.onload = () => {
      renderWidget()
    }

    document.head.appendChild(script)
  }, [])

  const reset = useCallback(() => {
    setState('idle')
    setToken(null)
  }, [])

  return { containerRef, state, token, isVerified, reset }
}
