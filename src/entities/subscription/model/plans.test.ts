import { describe, expect, it } from 'vitest'

import { findSubscriptionPlan, formatPriceCents, SUBSCRIPTION_PLANS } from './plans'

describe('SUBSCRIPTION_PLANS', () => {
  it('has one plan per period and no duplicates', () => {
    const ids = SUBSCRIPTION_PLANS.map(({ id }) => id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('prices every plan in whole cents and gives it a duration', () => {
    SUBSCRIPTION_PLANS.forEach((plan) => {
      expect(Number.isInteger(plan.priceCents)).toBe(true)
      expect(plan.durationDays).toBeGreaterThan(0)
    })
  })
})

describe('findSubscriptionPlan', () => {
  it('finds a known plan', () => {
    expect(findSubscriptionPlan('week')?.durationDays).toBe(7)
  })

  it('returns null for anything else', () => {
    expect(findSubscriptionPlan('century')).toBeNull()
  })
})

describe('formatPriceCents', () => {
  it('keeps whole dollars short', () => {
    expect(formatPriceCents(1000)).toBe('$10')
  })

  it('shows cents when there are any', () => {
    expect(formatPriceCents(1050)).toBe('$10.50')
  })
})
