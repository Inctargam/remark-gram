import type { Payment } from '@/entities/payment'
import { PAYMENT_PROVIDER_LABELS } from '@/entities/payment'
import { formatPriceCents, SUBSCRIPTION_PERIOD_LABELS } from '@/entities/subscription'
import { formatShortDate } from '@/shared/lib/date'
import { Alert } from '@/shared/ui/alert'
import { Pagination } from '@/shared/ui/pagination'
import { Table } from '@/shared/ui/table'

import styles from './myPayments.module.css'

type Props = {
  errorMessage: string | null
  isLoading: boolean
  page: number
  pageSize: number
  payments: Payment[]
  totalPages: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const COLUMN_COUNT = 5

const EMPTY_MESSAGE = 'You have no payments yet.'

/**
 * The mock backend rejects a page size above 50, so the `100` of the default list is left
 * out — see 06_my_payments.md.
 */
const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 50]

export const MyPaymentsView = ({
  errorMessage,
  isLoading,
  page,
  pageSize,
  payments,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: Props) => {
  const hasPayments = payments.length > 0

  if (errorMessage) {
    return <Alert variant="error">{errorMessage}</Alert>
  }

  return (
    <div className={styles.root}>
      <Table.Root aria-busy={isLoading}>
        <Table.Head>
          <Table.Row>
            <Table.HeadCell>Date of Payment</Table.HeadCell>
            <Table.HeadCell>End date of subscription</Table.HeadCell>
            {/* Money is right-aligned in the design, header included. */}
            <Table.HeadCell className={styles.priceCell}>Price</Table.HeadCell>
            <Table.HeadCell>Subscription Type</Table.HeadCell>
            <Table.HeadCell>Payment Type</Table.HeadCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {isLoading ? <Table.Skeleton columns={COLUMN_COUNT} /> : null}

          {!isLoading && !hasPayments ? (
            <Table.Empty colSpan={COLUMN_COUNT}>{EMPTY_MESSAGE}</Table.Empty>
          ) : null}

          {payments.map(
            ({
              id,
              dateOfPayment,
              endDateOfSubscription,
              priceCents,
              subscriptionType,
              paymentType,
            }) => (
              <Table.Row key={id}>
                <Table.Cell>{formatShortDate(dateOfPayment)}</Table.Cell>
                <Table.Cell>{formatShortDate(endDateOfSubscription)}</Table.Cell>
                <Table.Cell className={styles.priceCell}>{formatPriceCents(priceCents)}</Table.Cell>
                <Table.Cell>{SUBSCRIPTION_PERIOD_LABELS[subscriptionType]}</Table.Cell>
                <Table.Cell>{PAYMENT_PROVIDER_LABELS[paymentType]}</Table.Cell>
              </Table.Row>
            )
          )}
        </Table.Body>
      </Table.Root>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        itemsPerPage={pageSize}
        itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
        onPageChange={onPageChange}
        onItemsPerPageChange={onPageSizeChange}
      />
    </div>
  )
}
