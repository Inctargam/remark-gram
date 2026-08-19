import { beforeEach, describe, expect, it } from 'vitest'

import {
  completeCheckoutSession,
  createCheckoutSession,
  findCheckoutSession,
  getAccountStatus,
  listPayments,
  resetSubscriptionsMockStore,
  setAutoRenewal,
} from './subscriptionsStore'

const NOW_MS = Date.UTC(2026, 7, 10, 12, 0, 0)
const DAY_IN_MS = 24 * 60 * 60 * 1000

/** Walks the whole buy flow: create a session, then report the outcome back. */
const buy = (planId: 'day' | 'week' | 'month', nowMs = NOW_MS, provider = 'stripe' as const) => {
  const session = createCheckoutSession({ planId, provider })

  return completeCheckoutSession({ sessionId: session.id, outcome: 'success', nowMs })
}

beforeEach(() => {
  resetSubscriptionsMockStore()
})

describe('seed', () => {
  it('starts as a personal account with no subscription', () => {
    const status = getAccountStatus()

    expect(status.accountType).toBe('personal')
    expect(status.subscriptions).toHaveLength(0)
    expect(status.nextPaymentAt).toBeNull()
  })

  it('seeds a payment history so the payments table has something to page through', () => {
    expect(listPayments({ page: 1, pageSize: 10 }).totalCount).toBe(14)
  })
})

describe('completeCheckoutSession', () => {
  it('turns the account into business and starts the subscription right away', () => {
    const result = buy('day')
    const [subscription] = result?.accountStatus?.subscriptions ?? []

    expect(result?.outcome).toBe('success')
    expect(result?.accountStatus?.accountType).toBe('business')
    expect(subscription.startsAt).toBe(new Date(NOW_MS).toISOString())
    expect(subscription.expiresAt).toBe(new Date(NOW_MS + DAY_IN_MS).toISOString())
    expect(subscription.autoRenewal).toBe(true)
  })

  it('logs the payment at the top of the history', () => {
    buy('week')

    const [payment] = listPayments({ page: 1, pageSize: 10 }).items

    expect(payment.subscriptionType).toBe('week')
    expect(payment.priceCents).toBe(5000)
    expect(payment.paymentType).toBe('stripe')
    expect(payment.dateOfPayment).toBe(new Date(NOW_MS).toISOString())
  })

  it('logs a paypal purchase with the paypal payment type', () => {
    buy('day', NOW_MS, 'paypal')

    const [payment] = listPayments({ page: 1, pageSize: 10 }).items
    const subscription = getAccountStatus().subscriptions.at(-1)

    expect(payment.paymentType).toBe('paypal')
    expect(subscription?.provider).toBe('paypal')
  })

  it('leaves the account untouched when the payment fails', () => {
    const session = createCheckoutSession({ planId: 'day', provider: 'stripe' })
    const result = completeCheckoutSession({
      sessionId: session.id,
      outcome: 'failed',
      nowMs: NOW_MS,
    })
    const status = getAccountStatus()

    expect(result?.outcome).toBe('failed')
    expect(result?.accountStatus).toBeNull()
    expect(status.accountType).toBe('personal')
    expect(status.subscriptions).toHaveLength(0)
    expect(listPayments({ page: 1, pageSize: 10 }).totalCount).toBe(14)
  })

  it('rejects an unknown session', () => {
    expect(completeCheckoutSession({ sessionId: 'nope', outcome: 'success' })).toBeNull()
  })

  // A returned user reloading the page must not be charged a second time.
  it('refuses to complete the same session twice', () => {
    const session = createCheckoutSession({ planId: 'day', provider: 'stripe' })

    completeCheckoutSession({ sessionId: session.id, outcome: 'success', nowMs: NOW_MS })

    expect(
      completeCheckoutSession({ sessionId: session.id, outcome: 'success', nowMs: NOW_MS })
    ).toBeNull()
    expect(getAccountStatus().subscriptions).toHaveLength(1)
  })

  it('records the outcome on the session', () => {
    const session = createCheckoutSession({ planId: 'day', provider: 'paypal' })

    completeCheckoutSession({ sessionId: session.id, outcome: 'failed', nowMs: NOW_MS })

    expect(findCheckoutSession(session.id)?.outcome).toBe('failed')
  })
})

describe('subscription queue', () => {
  it('appends the second subscription after the first one expires', () => {
    buy('day')

    const status = buy('week')?.accountStatus
    const [first, second] = status?.subscriptions ?? []

    expect(status?.subscriptions).toHaveLength(2)
    expect(second.startsAt).toBe(first.expiresAt)
    expect(second.expiresAt).toBe(
      new Date(Date.parse(first.expiresAt) + 7 * DAY_IN_MS).toISOString()
    )
  })

  // UC-3 step 9 / decision Р5: the invariant lives here, not in the UI.
  it('leaves auto-renewal enabled only on the newest subscription', () => {
    buy('day')
    buy('week')

    const status = buy('month')?.accountStatus

    expect(status?.subscriptions.map(({ autoRenewal }) => autoRenewal)).toEqual([
      false,
      false,
      true,
    ])
  })

  it('starts from now again once the queue has run out', () => {
    buy('day')

    const laterMs = NOW_MS + 10 * DAY_IN_MS
    const status = buy('day', laterMs)?.accountStatus

    expect(status?.subscriptions.at(-1)?.startsAt).toBe(new Date(laterMs).toISOString())
  })
})

describe('setAutoRenewal', () => {
  it('toggles the flag of the queue tail and clears the next payment date', () => {
    buy('day')

    const status = setAutoRenewal(false)

    expect(status?.subscriptions.at(-1)?.autoRenewal).toBe(false)
    expect(status?.nextPaymentAt).toBeNull()
  })

  it('reports the tail expiry as the next payment while auto-renewal is on', () => {
    const bought = buy('day')?.accountStatus

    setAutoRenewal(false)

    expect(setAutoRenewal(true)?.nextPaymentAt).toBe(bought?.subscriptions.at(-1)?.expiresAt)
  })

  it('has nothing to toggle without a subscription', () => {
    expect(setAutoRenewal(true)).toBeNull()
  })
})

describe('listPayments', () => {
  it('cuts the history into pages and reports the totals', () => {
    const page = listPayments({ page: 1, pageSize: 10 })

    expect(page.items).toHaveLength(10)
    expect(page.totalPages).toBe(2)
    expect(page.totalCount).toBe(14)
  })

  it('returns the remainder on the last page', () => {
    expect(listPayments({ page: 2, pageSize: 10 }).items).toHaveLength(4)
  })

  it('does not repeat rows across pages', () => {
    const ids = [
      ...listPayments({ page: 1, pageSize: 10 }).items,
      ...listPayments({ page: 2, pageSize: 10 }).items,
    ].map(({ id }) => id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('answers an out-of-range page with no items but keeps the totals', () => {
    const page = listPayments({ page: 99, pageSize: 10 })

    expect(page.items).toHaveLength(0)
    expect(page.totalPages).toBe(2)
  })
})
