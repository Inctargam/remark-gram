import { describe, expect, it } from 'vitest'

import { buildPaymentReturnUrl } from './buildPaymentReturnUrl'

const ORIGIN = 'http://localhost:3000'
const FALLBACK_PATH = '/profile/settings'

describe('buildPaymentReturnUrl', () => {
  it('attaches the outcome to the url the checkout session was started from', () => {
    const url = buildPaymentReturnUrl({
      returnUrl: `${ORIGIN}/profile/settings`,
      outcome: 'success',
      origin: ORIGIN,
      fallbackPath: FALLBACK_PATH,
    })

    expect(url).toBe(`${ORIGIN}/profile/settings?payment=success`)
  })

  it('keeps the query the caller already had', () => {
    const url = buildPaymentReturnUrl({
      returnUrl: `${ORIGIN}/profile/settings?tab=account`,
      outcome: 'failed',
      origin: ORIGIN,
      fallbackPath: FALLBACK_PATH,
    })

    expect(url).toBe(`${ORIGIN}/profile/settings?tab=account&payment=failed`)
  })

  it('replaces a result the url already carried instead of doubling the param', () => {
    const url = buildPaymentReturnUrl({
      returnUrl: `${ORIGIN}/profile/settings?payment=failed`,
      outcome: 'success',
      origin: ORIGIN,
      fallbackPath: FALLBACK_PATH,
    })

    expect(url).toBe(`${ORIGIN}/profile/settings?payment=success`)
  })

  it('falls back to the settings page for an off-origin return url', () => {
    const url = buildPaymentReturnUrl({
      returnUrl: 'https://evil.example.com/steal',
      outcome: 'success',
      origin: ORIGIN,
      fallbackPath: FALLBACK_PATH,
    })

    expect(url).toBe(`${ORIGIN}/profile/settings?payment=success`)
  })

  it('falls back when the return url is missing or unparsable', () => {
    const expected = `${ORIGIN}/profile/settings?payment=failed`

    expect(
      buildPaymentReturnUrl({
        returnUrl: '',
        outcome: 'failed',
        origin: ORIGIN,
        fallbackPath: FALLBACK_PATH,
      })
    ).toBe(expected)

    expect(
      buildPaymentReturnUrl({
        returnUrl: 'http://',
        outcome: 'failed',
        origin: ORIGIN,
        fallbackPath: FALLBACK_PATH,
      })
    ).toBe(expected)
  })
})
