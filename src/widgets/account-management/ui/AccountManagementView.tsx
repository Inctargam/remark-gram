import type { AccountType, PaymentProvider, SubscriptionPeriod } from '@/entities/subscription'
import { SUBSCRIPTION_PLANS } from '@/entities/subscription'
import { formatShortDate } from '@/shared/lib/date'
import { Alert } from '@/shared/ui/alert'
import { Card } from '@/shared/ui/card'
import { Icon } from '@/shared/ui/icon'
import type { RadioGroupOption } from '@/shared/ui/radio-group'
import { RadioGroup } from '@/shared/ui/radio-group'

import type { CurrentSubscriptionInfo } from '../model/types'
import styles from './accountManagement.module.css'

type Props = {
  accountType: AccountType
  currentSubscription: CurrentSubscriptionInfo | null
  errorMessage: string | null
  isLoading: boolean
  /** Downgrading to Personal is a backend job, so the option is locked while a plan is paid. */
  isPersonalDisabled: boolean
  selectedPlanId: SubscriptionPeriod
  onAccountTypeChange: (accountType: AccountType) => void
  onPlanChange: (planId: SubscriptionPeriod) => void
  /** Left out until the payment flow exists: without it the provider buttons stay disabled. */
  onProviderSelect?: (provider: PaymentProvider) => void
}

const PLAN_OPTIONS: RadioGroupOption<SubscriptionPeriod>[] = SUBSCRIPTION_PLANS.map(
  ({ id, label }) => ({ value: id, label })
)

const NO_DATE_PLACEHOLDER = '—'

export const AccountManagementView = ({
  accountType,
  currentSubscription,
  errorMessage,
  isLoading,
  isPersonalDisabled,
  selectedPlanId,
  onAccountTypeChange,
  onPlanChange,
  onProviderSelect,
}: Props) => {
  const isBusiness = accountType === 'business'
  const plansTitle = currentSubscription ? 'Change your subscription:' : 'Your subscription costs:'

  if (errorMessage) {
    return <Alert variant="error">{errorMessage}</Alert>
  }

  if (isLoading) {
    return <p className={styles.message}>Loading subscription…</p>
  }

  return (
    <div className={styles.root}>
      {currentSubscription ? (
        <section className={styles.section}>
          <h2 className={styles.title}>Current Subscription:</h2>
          <Card className={styles.subscriptionCard} padding="none">
            <dl className={styles.subscriptionItem}>
              <dt className={styles.subscriptionLabel}>Expire at</dt>
              <dd className={styles.subscriptionValue}>
                {formatShortDate(currentSubscription.expiresAt)}
              </dd>
            </dl>
            <dl className={styles.subscriptionItem}>
              <dt className={styles.subscriptionLabel}>Next payment</dt>
              <dd className={styles.subscriptionValue}>
                {currentSubscription.nextPaymentAt
                  ? formatShortDate(currentSubscription.nextPaymentAt)
                  : NO_DATE_PLACEHOLDER}
              </dd>
            </dl>
          </Card>
        </section>
      ) : null}

      <section className={styles.section}>
        <h2 className={styles.title}>Account type:</h2>
        <Card className={styles.optionsCard}>
          <RadioGroup<AccountType>
            className={styles.options}
            value={accountType}
            onValueChange={onAccountTypeChange}
            options={[
              { value: 'personal', label: 'Personal', disabled: isPersonalDisabled },
              { value: 'business', label: 'Business' },
            ]}
          />
        </Card>
      </section>

      {isBusiness ? (
        <>
          <section className={styles.section}>
            <h2 className={styles.title}>{plansTitle}</h2>
            <Card className={styles.optionsCard}>
              <RadioGroup<SubscriptionPeriod>
                className={styles.options}
                value={selectedPlanId}
                onValueChange={onPlanChange}
                options={PLAN_OPTIONS}
              />
            </Card>
          </section>

          <div className={styles.providers}>
            <button
              type="button"
              className={styles.provider}
              disabled={!onProviderSelect}
              aria-label="Pay with PayPal"
              onClick={() => onProviderSelect?.('paypal')}>
              <Icon iconId="icon-paypal" width={64} height={43} viewBox="0 0 24 16" fill="none" />
            </button>
            <span className={styles.providersSeparator}>Or</span>
            <button
              type="button"
              className={styles.provider}
              disabled={!onProviderSelect}
              aria-label="Pay with Stripe"
              onClick={() => onProviderSelect?.('stripe')}>
              <Icon iconId="icon-stripe" width={64} height={43} viewBox="0 0 24 16" fill="none" />
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
}
