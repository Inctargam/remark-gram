import { describe, expect, it } from 'vitest'

import type { AccountStatus, Subscription } from '@/entities/subscription'

import { selectCurrentSubscription } from './selectCurrentSubscription'

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

describe('selectCurrentSubscription', () => {
  it('returns null while the account status is still loading', () => {
    expect(selectCurrentSubscription(undefined)).toBeNull()
  })

  it('returns null for an account without subscriptions', () => {
    expect(selectCurrentSubscription(createStatus())).toBeNull()
  })

  it('takes the expiry date from the tail of the queue', () => {
    const status = createStatus({
      subscriptions: [
        createSubscription('first', '2022-02-11T00:00:00.000Z'),
        createSubscription('second', '2022-02-12T00:00:00.000Z'),
      ],
      nextPaymentAt: '2022-02-12T00:00:00.000Z',
    })

    expect(selectCurrentSubscription(status)).toEqual({
      expiresAt: '2022-02-12T00:00:00.000Z',
      nextPaymentAt: '2022-02-12T00:00:00.000Z',
    })
  })

  it('keeps the next payment empty when auto-renewal is off', () => {
    const status = createStatus({
      subscriptions: [createSubscription('only', '2022-02-11T00:00:00.000Z')],
    })

    expect(selectCurrentSubscription(status)?.nextPaymentAt).toBeNull()
  })
})
