import { describe, expect, it } from 'vitest'

import { parseCheckoutOutcome } from './paymentResult'

describe('parseCheckoutOutcome', () => {
  it('recognizes both outcomes the payment service can report', () => {
    expect(parseCheckoutOutcome('success')).toBe('success')
    expect(parseCheckoutOutcome('failed')).toBe('failed')
  })

  it('returns null for a missing or hand-typed value', () => {
    expect(parseCheckoutOutcome(null)).toBeNull()
    expect(parseCheckoutOutcome(undefined)).toBeNull()
    expect(parseCheckoutOutcome('')).toBeNull()
    expect(parseCheckoutOutcome('SUCCESS')).toBeNull()
    expect(parseCheckoutOutcome('whatever')).toBeNull()
  })
})
