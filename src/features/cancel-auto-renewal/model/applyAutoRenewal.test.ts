import { describe, expect, it } from 'vitest'

import type { AccountStatus, Subscription } from '@/entities/subscription'

import { applyAutoRenewal } from './applyAutoRenewal'

const createSubscription = (id: string, expiresAt: string, autoRenewal = false): Subscription => ({
  id,
  planId: 'day',
  startsAt: '2022-02-10T00:00:00.000Z',
  expiresAt,
  autoRenewal,
  provider: 'stripe',
})

const createStatus = (
  subscriptions: Subscription[],
  nextPaymentAt: string | null
): AccountStatus => ({
  accountType: 'business',
  subscriptions,
  nextPaymentAt,
})

describe('applyAutoRenewal', () => {
  it('turns the flag off on the tail and clears the next payment', () => {
    const status = createStatus(
      [
        createSubscription('first', '2022-02-12T00:00:00.000Z'),
        createSubscription('tail', '2022-02-19T00:00:00.000Z', true),
      ],
      '2022-02-19T00:00:00.000Z'
    )

    const result = applyAutoRenewal(status, false)

    expect(result.subscriptions.at(-1)?.autoRenewal).toBe(false)
    expect(result.nextPaymentAt).toBeNull()
  })

  it('turns the flag on and puts the next payment at the end of the queue', () => {
    const status = createStatus(
      [
        createSubscription('first', '2022-02-12T00:00:00.000Z'),
        createSubscription('tail', '2022-02-19T00:00:00.000Z'),
      ],
      null
    )

    const result = applyAutoRenewal(status, true)

    expect(result.nextPaymentAt).toBe('2022-02-19T00:00:00.000Z')
  })

  it('never touches anything but the tail — only it may renew (Р5)', () => {
    const status = createStatus(
      [
        createSubscription('first', '2022-02-12T00:00:00.000Z'),
        createSubscription('tail', '2022-02-19T00:00:00.000Z'),
      ],
      null
    )

    const result = applyAutoRenewal(status, true)

    expect(result.subscriptions[0].autoRenewal).toBe(false)
  })

  it('leaves an account without subscriptions untouched', () => {
    const status = createStatus([], null)

    expect(applyAutoRenewal(status, true)).toBe(status)
  })
})
