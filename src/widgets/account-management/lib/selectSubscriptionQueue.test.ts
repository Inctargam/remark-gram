import { describe, expect, it } from 'vitest'

import type { AccountStatus, Subscription } from '@/entities/subscription'

import { selectSubscriptionQueue } from './selectSubscriptionQueue'

const createSubscription = (id: string, expiresAt: string): Subscription => ({
  id,
  planId: 'day',
  startsAt: '2022-02-10T00:00:00.000Z',
  expiresAt,
  autoRenewal: false,
  provider: 'stripe',
})

const createStatus = (status: Partial<AccountStatus> = {}): AccountStatus => ({
  accountType: 'business',
  subscriptions: [],
  nextPaymentAt: null,
  ...status,
})

describe('selectSubscriptionQueue', () => {
  it('returns nothing while the account status is still loading', () => {
    expect(selectSubscriptionQueue(undefined)).toEqual([])
  })

  it('returns nothing for an account without subscriptions', () => {
    expect(selectSubscriptionQueue(createStatus())).toEqual([])
  })

  it('gives the next payment to the tail only — the rest are already paid for', () => {
    const status = createStatus({
      subscriptions: [
        createSubscription('first', '2022-02-12T00:00:00.000Z'),
        createSubscription('second', '2022-02-19T00:00:00.000Z'),
      ],
      nextPaymentAt: '2022-02-19T00:00:00.000Z',
    })

    expect(selectSubscriptionQueue(status)).toEqual([
      { id: 'first', expiresAt: '2022-02-12T00:00:00.000Z', nextPaymentAt: null },
      {
        id: 'second',
        expiresAt: '2022-02-19T00:00:00.000Z',
        nextPaymentAt: '2022-02-19T00:00:00.000Z',
      },
    ])
  })

  it('keeps the next payment empty when auto-renewal is off', () => {
    const status = createStatus({
      subscriptions: [createSubscription('only', '2022-02-11T00:00:00.000Z')],
    })

    expect(selectSubscriptionQueue(status)[0].nextPaymentAt).toBeNull()
  })
})
