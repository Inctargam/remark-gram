import type { CheckoutOutcome, PaymentProvider, SubscriptionPeriod } from '@/entities/subscription'
import { findSubscriptionPlan } from '@/entities/subscription'
import {
  completeCheckoutSession,
  createCheckoutSession,
  getAccountStatus,
  setAutoRenewal,
} from '@/shared/api/mock/subscriptionsStore'

/** Where the payment-service stubs live. Real services would return their own hosted url here. */
const MOCK_CHECKOUT_PATHS: Record<PaymentProvider, string> = {
  stripe: '/payments/mock-checkout',
  paypal: '/payments/mock-paypal',
}

const PAYMENT_PROVIDERS: PaymentProvider[] = ['stripe', 'paypal']
const CHECKOUT_OUTCOMES: CheckoutOutcome[] = ['success', 'failed']

const isPaymentProvider = (value: unknown): value is PaymentProvider =>
  typeof value === 'string' && PAYMENT_PROVIDERS.includes(value as PaymentProvider)

const isCheckoutOutcome = (value: unknown): value is CheckoutOutcome =>
  typeof value === 'string' && CHECKOUT_OUTCOMES.includes(value as CheckoutOutcome)

const isSubscriptionPeriod = (value: unknown): value is SubscriptionPeriod =>
  typeof value === 'string' && findSubscriptionPlan(value) !== null

export const getCurrentSubscriptionHandler = async () => Response.json(getAccountStatus())

type CreateCheckoutRequestBody = {
  planId?: unknown
  provider?: unknown
  returnUrl?: unknown
}

/**
 * Stands in for `POST /v1/checkout/sessions`: hands back a session id and the url the browser
 * has to be sent to. `returnUrl` travels with the url, exactly as a real service would carry it.
 */
export const createCheckoutSessionHandler = async (request: Request) => {
  const body: CreateCheckoutRequestBody | null = await request.json().catch(() => null)

  if (!isSubscriptionPeriod(body?.planId)) {
    return Response.json({ message: 'planId must be a known subscription plan.' }, { status: 400 })
  }

  if (!isPaymentProvider(body?.provider)) {
    return Response.json(
      { message: `provider must be one of: ${PAYMENT_PROVIDERS.join(', ')}.` },
      { status: 400 }
    )
  }

  if (typeof body?.returnUrl !== 'string' || body.returnUrl.length === 0) {
    return Response.json({ message: 'returnUrl is required.' }, { status: 400 })
  }

  const session = createCheckoutSession({ planId: body.planId, provider: body.provider })
  const searchParams = new URLSearchParams({
    sessionId: session.id,
    returnUrl: body.returnUrl,
  })

  return Response.json(
    {
      sessionId: session.id,
      checkoutUrl: `${MOCK_CHECKOUT_PATHS[body.provider]}?${searchParams.toString()}`,
    },
    { status: 201 }
  )
}

type CompleteCheckoutRequestBody = {
  outcome?: unknown
}

export const completeCheckoutSessionHandler = async (request: Request, sessionId: string) => {
  const body: CompleteCheckoutRequestBody | null = await request.json().catch(() => null)

  if (!isCheckoutOutcome(body?.outcome)) {
    return Response.json(
      { message: `outcome must be one of: ${CHECKOUT_OUTCOMES.join(', ')}.` },
      { status: 400 }
    )
  }

  const result = completeCheckoutSession({ sessionId, outcome: body.outcome })

  // Unknown id and an already-finished session are the same answer on purpose: neither may
  // create a second subscription, and the return page has nothing different to do about it.
  if (!result) {
    return Response.json({ message: 'Unknown or already completed session.' }, { status: 409 })
  }

  return Response.json(result)
}

type AutoRenewalRequestBody = {
  autoRenewal?: unknown
}

export const setAutoRenewalHandler = async (request: Request) => {
  const body: AutoRenewalRequestBody | null = await request.json().catch(() => null)

  if (typeof body?.autoRenewal !== 'boolean') {
    return Response.json({ message: 'autoRenewal must be a boolean.' }, { status: 400 })
  }

  const accountStatus = setAutoRenewal(body.autoRenewal)

  if (!accountStatus) {
    return Response.json({ message: 'There is no active subscription.' }, { status: 404 })
  }

  return Response.json(accountStatus)
}
