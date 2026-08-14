import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/api/baseApi'

import type { AccountStatus } from '../model/types'
import {
  completeCheckoutSession,
  createCheckoutSession,
  getCurrentSubscription,
  setAutoRenewal,
} from './subscriptionsApi'

const accountStatus: AccountStatus = {
  accountType: 'business',
  subscriptions: [
    {
      id: 'subscription-1',
      planId: 'day',
      startsAt: '2026-08-10T12:00:00.000Z',
      expiresAt: '2026-08-11T12:00:00.000Z',
      autoRenewal: true,
      provider: 'stripe',
    },
  ],
  nextPaymentAt: '2026-08-11T12:00:00.000Z',
}

const fetchMock = vi.fn()

/** Last URL the api module asked `fetch` for. */
const getRequestedUrl = () => String(fetchMock.mock.calls[0]?.[0])
const getRequestInit = () => fetchMock.mock.calls[0]?.[1] as RequestInit

/** A fresh Response per call — a body can only be read once. */
const respondWith = (body: unknown, status = 200) => {
  fetchMock.mockImplementation(
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      })
  )
}

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_PAYMENTS_API_MOCK', 'true')
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  fetchMock.mockReset()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('getCurrentSubscription', () => {
  it('reads the account status from the mock path', async () => {
    respondWith(accountStatus)

    await expect(getCurrentSubscription()).resolves.toEqual(accountStatus)
    expect(getRequestedUrl()).toContain('/api/mock/subscriptions/current')
    expect(getRequestInit().method).toBe('GET')
  })

  it('targets the real backend path when the mock flag is off', async () => {
    vi.stubEnv('NEXT_PUBLIC_PAYMENTS_API_MOCK', 'false')
    respondWith(accountStatus)

    await getCurrentSubscription()

    expect(getRequestedUrl()).toContain('/api/v1/subscriptions/current')
  })

  it('throws ApiError with the server message on a failed request', async () => {
    respondWith({ message: 'Unauthorized.' }, 401)

    await expect(getCurrentSubscription()).rejects.toThrow(ApiError)
  })
})

describe('createCheckoutSession', () => {
  it('posts the plan, the provider and the return url', async () => {
    const payload = {
      planId: 'week' as const,
      provider: 'stripe' as const,
      returnUrl: '/profile/settings',
    }

    respondWith({ sessionId: 'session-1', checkoutUrl: '/payments/mock-checkout' }, 201)

    await expect(createCheckoutSession(payload)).resolves.toEqual({
      sessionId: 'session-1',
      checkoutUrl: '/payments/mock-checkout',
    })
    expect(getRequestedUrl()).toContain('/api/mock/subscriptions/checkout')
    expect(getRequestInit().method).toBe('POST')
    expect(getRequestInit().body).toBe(JSON.stringify(payload))
  })
})

describe('completeCheckoutSession', () => {
  it('reports the outcome under the session id', async () => {
    respondWith({ outcome: 'success', accountStatus })

    await completeCheckoutSession('session-1', 'success')

    expect(getRequestedUrl()).toContain('/api/mock/subscriptions/checkout/session-1/complete')
    expect(getRequestInit().body).toBe(JSON.stringify({ outcome: 'success' }))
  })
})

describe('setAutoRenewal', () => {
  it('patches the flag and returns the updated status', async () => {
    respondWith({ ...accountStatus, nextPaymentAt: null })

    await expect(setAutoRenewal(false)).resolves.toEqual({ ...accountStatus, nextPaymentAt: null })
    expect(getRequestedUrl()).toContain('/api/mock/subscriptions/auto-renewal')
    expect(getRequestInit().method).toBe('PATCH')
    expect(getRequestInit().body).toBe(JSON.stringify({ autoRenewal: false }))
  })
})
