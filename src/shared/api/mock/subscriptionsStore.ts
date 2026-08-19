import type { Payment, PaymentsPage } from '@/entities/payment'
import type {
  AccountStatus,
  AccountType,
  CheckoutOutcome,
  CheckoutSession,
  PaymentProvider,
  Subscription,
  SubscriptionPeriod,
} from '@/entities/subscription'
import { findSubscriptionPlan } from '@/entities/subscription'

/**
 * In-memory subscriptions/payments store for the mock API.
 * Kept on `globalThis` so it survives dev-server hot reloads — otherwise every edit
 * would reset a subscription the tester just bought.
 *
 * The store owns the domain rules, not the screens. Most notably the one from UC-3 step 9:
 * only the last subscription of the queue may have auto-renewal enabled. Keeping it here
 * means the rule will not be duplicated once the real backend arrives.
 */
const STORE_KEY = '__inctagramSubscriptionsMockStore'

type SubscriptionsStoreState = {
  accountType: AccountType
  /** Ascending by `startsAt`; the last item is the tail of the queue. */
  subscriptions: Subscription[]
  /** Newest first — the order the payments table renders. */
  payments: Payment[]
  checkoutSessions: CheckoutSession[]
}

type GlobalWithSubscriptionsStore = typeof globalThis & {
  [STORE_KEY]?: SubscriptionsStoreState
}

const DAY_IN_MS = 24 * 60 * 60 * 1000

/** Fixed base date keeps the seeded payment history (and its tests) deterministic. */
const SEED_BASE_TIME = Date.UTC(2026, 6, 1, 12, 0, 0)
const SEED_PAYMENTS_COUNT = 14

const SEED_PAYMENT_SHAPES: { planId: SubscriptionPeriod; provider: PaymentProvider }[] = [
  { planId: 'day', provider: 'stripe' },
  { planId: 'week', provider: 'paypal' },
  { planId: 'month', provider: 'stripe' },
]

/**
 * The seeded account is `personal` with no active subscription but with a payment history:
 * that is the state UC-1 starts from, and it still gives UC-4 enough rows to page through.
 */
const createSeedPayments = (): Payment[] =>
  Array.from({ length: SEED_PAYMENTS_COUNT }, (_, index) => {
    const shape = SEED_PAYMENT_SHAPES[index % SEED_PAYMENT_SHAPES.length]
    const plan = findSubscriptionPlan(shape.planId)
    const paidAt = SEED_BASE_TIME - index * 3 * DAY_IN_MS

    return {
      id: `mock-payment-${String(index + 1).padStart(2, '0')}`,
      dateOfPayment: new Date(paidAt).toISOString(),
      endDateOfSubscription: new Date(paidAt + (plan?.durationDays ?? 1) * DAY_IN_MS).toISOString(),
      priceCents: plan?.priceCents ?? 0,
      subscriptionType: shape.planId,
      paymentType: shape.provider,
    }
  })

const createSeedState = (): SubscriptionsStoreState => ({
  accountType: 'personal',
  subscriptions: [],
  payments: createSeedPayments(),
  checkoutSessions: [],
})

const getState = (): SubscriptionsStoreState => {
  const globalWithStore = globalThis as GlobalWithSubscriptionsStore

  globalWithStore[STORE_KEY] ??= createSeedState()

  return globalWithStore[STORE_KEY]
}

/** Test-only: brings the store back to its seeded state. */
export const resetSubscriptionsMockStore = () => {
  ;(globalThis as GlobalWithSubscriptionsStore)[STORE_KEY] = createSeedState()
}

const getTailSubscription = (state: SubscriptionsStoreState): Subscription | null =>
  state.subscriptions.at(-1) ?? null

/**
 * The next charge is the moment the queue tail expires — but only while auto-renewal is on.
 * With it off the subscription simply ends, so there is nothing to show.
 */
const getNextPaymentAt = (state: SubscriptionsStoreState): string | null => {
  const tail = getTailSubscription(state)

  return tail?.autoRenewal ? tail.expiresAt : null
}

const toAccountStatus = (state: SubscriptionsStoreState): AccountStatus => ({
  accountType: state.accountType,
  subscriptions: state.subscriptions.map((subscription) => ({ ...subscription })),
  nextPaymentAt: getNextPaymentAt(state),
})

export const getAccountStatus = (): AccountStatus => toAccountStatus(getState())

export type CreateCheckoutSessionParams = {
  planId: SubscriptionPeriod
  provider: PaymentProvider
}

/**
 * Stands in for creating a session at the payment service: the id is all the stub page
 * needs to report an outcome back.
 */
export const createCheckoutSession = ({
  planId,
  provider,
}: CreateCheckoutSessionParams): CheckoutSession => {
  const session: CheckoutSession = {
    id: crypto.randomUUID(),
    planId,
    provider,
    outcome: null,
    createdAt: new Date().toISOString(),
  }

  getState().checkoutSessions.push(session)

  return session
}

export const findCheckoutSession = (sessionId: string): CheckoutSession | null =>
  getState().checkoutSessions.find((session) => session.id === sessionId) ?? null

/**
 * A new subscription starts when the current queue ends, not right away (UC-3): buying while
 * one is active appends to the queue. `nowMs` is injectable so tests do not depend on the clock.
 */
const createSubscription = (
  state: SubscriptionsStoreState,
  { planId, provider }: CreateCheckoutSessionParams,
  nowMs: number
): Subscription => {
  const plan = findSubscriptionPlan(planId)
  const durationMs = (plan?.durationDays ?? 1) * DAY_IN_MS
  const tail = getTailSubscription(state)
  const tailExpiresAtMs = tail ? Date.parse(tail.expiresAt) : 0
  const startsAtMs = Math.max(nowMs, tailExpiresAtMs)

  // UC-3 step 9: the system may hold exactly one enabled auto-renewal, and it belongs to
  // the newest subscription. Clearing the flag here is what keeps that true by construction.
  state.subscriptions.forEach((subscription) => {
    subscription.autoRenewal = false
  })

  const subscription: Subscription = {
    id: crypto.randomUUID(),
    planId,
    startsAt: new Date(startsAtMs).toISOString(),
    expiresAt: new Date(startsAtMs + durationMs).toISOString(),
    autoRenewal: true,
    provider,
  }

  state.subscriptions.push(subscription)
  state.accountType = 'business'

  state.payments.unshift({
    id: crypto.randomUUID(),
    dateOfPayment: new Date(nowMs).toISOString(),
    endDateOfSubscription: subscription.expiresAt,
    priceCents: plan?.priceCents ?? 0,
    subscriptionType: planId,
    paymentType: provider,
  })

  return subscription
}

export type CompleteCheckoutParams = {
  sessionId: string
  outcome: CheckoutOutcome
  /** Injectable clock; defaults to now. */
  nowMs?: number
}

export type CompleteCheckoutResult = {
  outcome: CheckoutOutcome
  accountStatus: AccountStatus | null
}

/**
 * Reports the payment result back from the service stub. Returns `null` for an unknown or
 * already-finished session, so a replayed return url cannot charge the user twice.
 */
export const completeCheckoutSession = ({
  sessionId,
  outcome,
  nowMs = Date.now(),
}: CompleteCheckoutParams): CompleteCheckoutResult | null => {
  const state = getState()
  const session = state.checkoutSessions.find((item) => item.id === sessionId)

  if (!session || session.outcome !== null) {
    return null
  }

  session.outcome = outcome

  if (outcome === 'failed') {
    return { outcome, accountStatus: null }
  }

  createSubscription(state, { planId: session.planId, provider: session.provider }, nowMs)

  return { outcome, accountStatus: toAccountStatus(state) }
}

/**
 * UC-2: the checkbox belongs to the queue tail, so the flag is toggled there and nowhere else.
 * Returns `null` when there is nothing to renew.
 */
export const setAutoRenewal = (autoRenewal: boolean): AccountStatus | null => {
  const state = getState()
  const tail = getTailSubscription(state)

  if (!tail) {
    return null
  }

  tail.autoRenewal = autoRenewal

  return toAccountStatus(state)
}

export type ListPaymentsParams = {
  page: number
  pageSize: number
}

/**
 * Offset pagination for the payments table. An out-of-range page returns no items but keeps
 * the totals, so the UI can still render the pager instead of breaking.
 */
export const listPayments = ({ page, pageSize }: ListPaymentsParams): PaymentsPage => {
  const { payments } = getState()
  const totalCount = payments.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const startIndex = (page - 1) * pageSize

  return {
    items: payments.slice(startIndex, startIndex + pageSize),
    page,
    pageSize,
    totalCount,
    totalPages,
  }
}
