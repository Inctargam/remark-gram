/**
 * PayPal integration config. The client id is empty until the real backend exists —
 * the mock payment flow does not need it, and keys must never be hardcoded here.
 */
export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? ''

/**
 * Sandbox/live switch. The mock flow ignores it, but it keeps the env contract explicit
 * for the real integration, mirroring `NEXT_PUBLIC_PAYMENTS_API_MOCK`.
 */
export const PAYPAL_SANDBOX = process.env.NEXT_PUBLIC_PAYPAL_SANDBOX === 'true'

/**
 * Base of the hosted approval page. Useful for the real flow, where the backend returns
 * a relative approval token instead of a full url — the client appends it to this base.
 */
export const PAYPAL_APPROVAL_BASE_URL = PAYPAL_SANDBOX
  ? 'https://www.sandbox.paypal.com'
  : 'https://www.paypal.com'
