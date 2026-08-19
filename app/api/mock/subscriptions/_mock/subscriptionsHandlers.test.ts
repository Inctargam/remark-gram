import { beforeEach, describe, expect, it } from 'vitest'

import type { AccountStatus } from '@/entities/subscription'
import { resetSubscriptionsMockStore } from '@/shared/api/mock/subscriptionsStore'

import {
  completeCheckoutSessionHandler,
  createCheckoutSessionHandler,
  getCurrentSubscriptionHandler,
  setAutoRenewalHandler,
} from './subscriptionsHandlers'

const MOCK_API_ORIGIN = 'https://dev.remark-gram.com:3000/api/mock/subscriptions'
const RETURN_URL = '/profile/settings?tab=account-management'

const createJsonRequest = (path: string, method: string, payload: unknown) =>
  new Request(`${MOCK_API_ORIGIN}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

const createSession = async (
  payload: unknown = {
    planId: 'day',
    provider: 'stripe',
    returnUrl: RETURN_URL,
  }
) => createCheckoutSessionHandler(createJsonRequest('/checkout', 'POST', payload))

const completeSession = (sessionId: string, outcome: unknown) =>
  completeCheckoutSessionHandler(
    createJsonRequest(`/checkout/${sessionId}/complete`, 'POST', { outcome }),
    sessionId
  )

beforeEach(() => {
  resetSubscriptionsMockStore()
})

describe('getCurrentSubscriptionHandler', () => {
  it('returns the seeded personal account', async () => {
    const response = await getCurrentSubscriptionHandler()
    const status: AccountStatus = await response.json()

    expect(response.status).toBe(200)
    expect(status.accountType).toBe('personal')
    expect(status.subscriptions).toEqual([])
  })
})

describe('createCheckoutSessionHandler', () => {
  it('returns a session id and a checkout url carrying the return url', async () => {
    const response = await createSession()
    const { sessionId, checkoutUrl } = await response.json()
    const { pathname, searchParams } = new URL(checkoutUrl, MOCK_API_ORIGIN)

    expect(response.status).toBe(201)
    expect(pathname).toBe('/payments/mock-checkout')
    expect(searchParams.get('sessionId')).toBe(sessionId)
    expect(searchParams.get('returnUrl')).toBe(RETURN_URL)
  })

  it('returns a paypal checkout url for the paypal provider', async () => {
    const response = await createSession({
      planId: 'day',
      provider: 'paypal',
      returnUrl: RETURN_URL,
    })
    const { sessionId, checkoutUrl } = await response.json()
    const { pathname, searchParams } = new URL(checkoutUrl, MOCK_API_ORIGIN)

    expect(response.status).toBe(201)
    expect(pathname).toBe('/payments/mock-paypal')
    expect(searchParams.get('sessionId')).toBe(sessionId)
    expect(searchParams.get('returnUrl')).toBe(RETURN_URL)
  })

  it('rejects an unknown plan', async () => {
    const response = await createSession({
      planId: 'century',
      provider: 'stripe',
      returnUrl: RETURN_URL,
    })

    expect(response.status).toBe(400)
  })

  it('rejects an unknown provider', async () => {
    const response = await createSession({ planId: 'day', provider: 'cash', returnUrl: RETURN_URL })

    expect(response.status).toBe(400)
  })

  it('rejects a missing return url', async () => {
    const response = await createSession({ planId: 'day', provider: 'stripe' })

    expect(response.status).toBe(400)
  })
})

describe('completeCheckoutSessionHandler', () => {
  it('creates the subscription on success', async () => {
    const { sessionId } = await (await createSession()).json()
    const response = await completeSession(sessionId, 'success')
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(result.outcome).toBe('success')
    expect(result.accountStatus.accountType).toBe('business')
  })

  it('reports a failed payment without touching the account', async () => {
    const { sessionId } = await (await createSession()).json()
    const response = await completeSession(sessionId, 'failed')
    const result = await response.json()

    expect(result.outcome).toBe('failed')
    expect(result.accountStatus).toBeNull()
  })

  it('answers 409 on an unknown or replayed session', async () => {
    const { sessionId } = await (await createSession()).json()

    await completeSession(sessionId, 'success')

    expect((await completeSession(sessionId, 'success')).status).toBe(409)
    expect((await completeSession('nope', 'success')).status).toBe(409)
  })

  it('rejects an unknown outcome', async () => {
    const { sessionId } = await (await createSession()).json()

    expect((await completeSession(sessionId, 'maybe')).status).toBe(400)
  })
})

describe('setAutoRenewalHandler', () => {
  it('turns auto-renewal off for the active subscription', async () => {
    const { sessionId } = await (await createSession()).json()

    await completeSession(sessionId, 'success')

    const response = await setAutoRenewalHandler(
      createJsonRequest('/auto-renewal', 'PATCH', { autoRenewal: false })
    )
    const status: AccountStatus = await response.json()

    expect(response.status).toBe(200)
    expect(status.subscriptions.at(-1)?.autoRenewal).toBe(false)
  })

  it('answers 404 when there is no subscription', async () => {
    const response = await setAutoRenewalHandler(
      createJsonRequest('/auto-renewal', 'PATCH', { autoRenewal: false })
    )

    expect(response.status).toBe(404)
  })

  it('rejects a non-boolean flag', async () => {
    const response = await setAutoRenewalHandler(
      createJsonRequest('/auto-renewal', 'PATCH', { autoRenewal: 'yes' })
    )

    expect(response.status).toBe(400)
  })
})
