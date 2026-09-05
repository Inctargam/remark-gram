import { api } from '@/shared/api/baseApi'

import type {
  AccountStatus,
  CheckoutOutcome,
  PaymentProvider,
  SubscriptionPeriod,
} from '../model/types'

/**
 * The only place that talks to the subscriptions API — the same contract the posts entity
 * follows. Hooks and UI never call `fetch`, so moving off the mock is a change in this file.
 *
 * Paths mirror the future real ones and differ by prefix only:
 * mock `/api/mock/subscriptions`, real `${NEXT_PUBLIC_API_BASE_URL}/api/v1/subscriptions`.
 * The mock is a route handler of this very app, so it is requested on the current origin
 * and must not inherit the backend base url.
 *
 * TODO(subscriptions-schema): replace hand-written types and paths with the generated
 * openapi-fetch client once subscription endpoints appear in `schema.d.ts`.
 *
 * TODO(paypal-capture): the real PayPal return leg differs from Stripe — the approval
 * redirect brings back `token`/`PayerID` query params and needs a server-to-server
 * capture before the outcome is known. Add `capturePaypalOrder({ token })` here once the
 * backend exposes the capture endpoint; the mock flow needs nothing extra.
 */
const MOCK_SUBSCRIPTIONS_PATH = '/api/mock/subscriptions'
const REAL_SUBSCRIPTIONS_PATH = '/api/v1/subscriptions'

/** Read at call time, not at module load, so tests can flip the flag. */
const isMockPaymentsApi = () => process.env.NEXT_PUBLIC_PAYMENTS_API_MOCK === 'true'

const getBasePath = () => (isMockPaymentsApi() ? MOCK_SUBSCRIPTIONS_PATH : REAL_SUBSCRIPTIONS_PATH)

/** Empty base url keeps mock calls on the current origin; real ones fall back to the API base. */
const getRequestInit = () => (isMockPaymentsApi() ? { baseUrl: '' } : undefined)

export const getCurrentSubscription = async (): Promise<AccountStatus> => {
  const response = await api.get(`${getBasePath()}/current`, getRequestInit())

  return response.json()
}

export type CreateCheckoutSessionPayload = {
  planId: SubscriptionPeriod
  provider: PaymentProvider
  /** Where the payment service sends the user back; the result arrives as a query param. */
  returnUrl: string
}

export type CheckoutSessionCreated = {
  sessionId: string
  /** Absolute or app-relative url the browser is redirected to. */
  checkoutUrl: string
}

export const createCheckoutSession = async (
  payload: CreateCheckoutSessionPayload
): Promise<CheckoutSessionCreated> => {
  const response = await api.post(`${getBasePath()}/checkout`, payload, getRequestInit())

  return response.json()
}

export type CompleteCheckoutResult = {
  outcome: CheckoutOutcome
  /** Present only on a successful payment. */
  accountStatus: AccountStatus | null
}

/**
 * Called by the payment-service stub, not by the app screens: it is what the external
 * service would do server-to-server. Kept here so every payments request has one home.
 */
export const completeCheckoutSession = async (
  sessionId: string,
  outcome: CheckoutOutcome
): Promise<CompleteCheckoutResult> => {
  const response = await api.post(
    `${getBasePath()}/checkout/${sessionId}/complete`,
    { outcome },
    getRequestInit()
  )

  return response.json()
}

export const setAutoRenewal = async (autoRenewal: boolean): Promise<AccountStatus> => {
  const response = await api.patch(
    `${getBasePath()}/auto-renewal`,
    { autoRenewal },
    getRequestInit()
  )

  return response.json()
}
