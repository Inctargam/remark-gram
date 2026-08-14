'use client'

import { useMyPayments } from '../model/useMyPayments'
import { MyPaymentsView } from './MyPaymentsView'

/**
 * The whole `My payments` tab (UC-4). Takes no props for the same reason as
 * `AccountManagement`: the settings shell only has to render it inside its tab panel.
 * It reads the page from the query string, so that panel needs a `Suspense` boundary.
 */
export const MyPayments = () => {
  const {
    errorMessage,
    isLoading,
    page,
    pageSize,
    payments,
    totalPages,
    changePageSize,
    goToPage,
  } = useMyPayments()

  return (
    <MyPaymentsView
      errorMessage={errorMessage}
      isLoading={isLoading}
      page={page}
      pageSize={pageSize}
      payments={payments}
      totalPages={totalPages}
      onPageChange={goToPage}
      onPageSizeChange={changePageSize}
    />
  )
}
