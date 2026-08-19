'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import type { Payment } from '@/entities/payment'
import { PAYMENTS_PAGE_SIZE, usePaymentsQuery } from '@/entities/payment'

import { buildPageQuery, FIRST_PAGE, parsePageParam, PAYMENTS_PAGE_PARAM } from '../lib/pageParam'

export type MyPaymentsState = {
  errorMessage: string | null
  isLoading: boolean
  page: number
  pageSize: number
  payments: Payment[]
  totalPages: number
  changePageSize: (pageSize: number) => void
  goToPage: (page: number) => void
}

const LOAD_ERROR_MESSAGE = 'Failed to load payments. Please try again.'

/**
 * The page is read from and written to the url; the page size is not, because it is a view
 * preference rather than a place in the list — a shared link should open the same rows
 * whatever the recipient's list length is.
 */
export const useMyPayments = (): MyPaymentsState => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pageSize, setPageSize] = useState(PAYMENTS_PAGE_SIZE)

  const page = parsePageParam(searchParams?.get(PAYMENTS_PAGE_PARAM))
  const { data, error, isPending } = usePaymentsQuery(page, pageSize)

  const goToPage = (nextPage: number) => {
    const query = buildPageQuery(searchParams?.toString(), nextPage)
    const currentPath = pathname ?? window.location.pathname

    // `replace`, not `push`: paging is not a step the back button should have to undo.
    router.replace(query ? `${currentPath}?${query}` : currentPath, { scroll: false })
  }

  const changePageSize = (nextPageSize: number) => {
    setPageSize(nextPageSize)
    // A longer page makes the old page number point somewhere else, or nowhere at all.
    goToPage(FIRST_PAGE)
  }

  return {
    errorMessage: error ? LOAD_ERROR_MESSAGE : null,
    isLoading: isPending,
    page,
    pageSize,
    payments: data?.items ?? [],
    totalPages: data?.totalPages ?? 0,
    changePageSize,
    goToPage,
  }
}
