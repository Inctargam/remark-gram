'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getPayments, PAYMENTS_PAGE_SIZE } from './paymentsApi'
import { paymentsQueryKeys } from './queryKeys'

/**
 * One page of the payments table. `keepPreviousData` holds the current rows while the next
 * page loads, so paging does not collapse the table to an empty state on every click.
 */
export const usePaymentsQuery = (page: number, pageSize: number = PAYMENTS_PAGE_SIZE) =>
  useQuery({
    queryKey: paymentsQueryKeys.list(page, pageSize),
    queryFn: () => getPayments({ page, pageSize }),
    placeholderData: keepPreviousData,
  })
