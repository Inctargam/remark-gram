import { PAYMENTS_PAGE_SIZE } from '@/entities/payment'
import { listPayments } from '@/shared/api/mock/subscriptionsStore'

const MAX_PAGE_SIZE = 50

const parseIntegerParam = (raw: string | null, fallback: number, max: number): number | null => {
  if (raw === null) {
    return fallback
  }

  const value = Number(raw)

  return Number.isInteger(value) && value > 0 && value <= max ? value : null
}

/** Page numbers are 1-based, matching `Pagination` from the UI kit. */
const MAX_PAGE = Number.MAX_SAFE_INTEGER

export const getPaymentsHandler = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const page = parseIntegerParam(searchParams.get('page'), 1, MAX_PAGE)
  const pageSize = parseIntegerParam(
    searchParams.get('pageSize'),
    PAYMENTS_PAGE_SIZE,
    MAX_PAGE_SIZE
  )

  if (page === null) {
    return Response.json({ message: 'page must be a positive integer.' }, { status: 400 })
  }

  if (pageSize === null) {
    return Response.json(
      { message: `pageSize must be an integer between 1 and ${MAX_PAGE_SIZE}.` },
      { status: 400 }
    )
  }

  return Response.json(listPayments({ page, pageSize }))
}
