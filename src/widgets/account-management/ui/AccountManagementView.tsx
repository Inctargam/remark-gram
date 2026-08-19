import type { ReactNode } from 'react'

import type { AccountType, PaymentProvider, SubscriptionPeriod } from '@/entities/subscription'
import { SUBSCRIPTION_PLANS } from '@/entities/subscription'
import { formatShortDate } from '@/shared/lib/date'
import { Alert } from '@/shared/ui/alert'
import { Card } from '@/shared/ui/card'
import { Icon } from '@/shared/ui/icon'
import type { RadioGroupOption } from '@/shared/ui/radio-group'
import { RadioGroup } from '@/shared/ui/radio-group'
import { Table } from '@/shared/ui/table'

import type { SubscriptionQueueItem } from '../model/types'
import styles from './accountManagement.module.css'

type Props = {
  accountType: AccountType
  /** UC-2 checkbox; a slot so this view stays free of data fetching. */
  autoRenewalSlot?: ReactNode
  errorMessage: string | null
  isLoading: boolean
  /** Downgrading to Personal is a backend job, so the option is locked while a plan is paid. */
  isPersonalDisabled: boolean
  selectedPlanId: SubscriptionPeriod
  /** Oldest first: the active subscription and everything bought on top of it (UC-3). */
  subscriptionQueue: SubscriptionQueueItem[]
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
  autoRenewalSlot,
  errorMessage,
  isLoading,
  isPersonalDisabled,
  selectedPlanId,
  subscriptionQueue,
  onAccountTypeChange,
  onPlanChange,
  onProviderSelect,
}: Props) => {
  const isBusiness = accountType === 'business'
  const hasSubscription = subscriptionQueue.length > 0
  const plansTitle = hasSubscription ? 'Change your subscription:' : 'Your subscription costs:'

  if (errorMessage) {
    return <Alert variant="error">{errorMessage}</Alert>
  }

  if (isLoading) {
    return <p className={styles.message}>Loading subscription…</p>
  }

  return (
    <div className={styles.root}>
      {hasSubscription ? (
        <section className={styles.section}>
          <h2 className={styles.title}>Current Subscription:</h2>
          {/* One row per subscription: buying on top of an active plan queues it up. */}
          <Table.Root wrapperClassName={styles.subscriptionTable}>
            <Table.Head className={styles.subscriptionHead}>
              <Table.Row>
                <Table.HeadCell className={styles.subscriptionLabel}>Expire at</Table.HeadCell>
                <Table.HeadCell className={styles.subscriptionLabel}>Next payment</Table.HeadCell>
              </Table.Row>
            </Table.Head>
            <Table.Body className={styles.subscriptionBody}>
              {subscriptionQueue.map(({ id, expiresAt, nextPaymentAt }) => (
                <Table.Row key={id}>
                  <Table.Cell className={styles.subscriptionValue}>
                    {formatShortDate(expiresAt)}
                  </Table.Cell>
                  <Table.Cell className={styles.subscriptionValue}>
                    {nextPaymentAt ? formatShortDate(nextPaymentAt) : NO_DATE_PLACEHOLDER}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {autoRenewalSlot}
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
