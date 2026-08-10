import { api } from '@/shared/api/baseApi'

import type { PaymentsPage } from '../model/types'

/**
 * The only place that talks to the payments API — same mock/real switch as
 * `entities/subscription/api/subscriptionsApi.ts`, driven by the same env flag because
 * both are served by one future backend module.
 */
const MOCK_PAYMENTS_PATH = '/api/mock/payments'
const REAL_PAYMENTS_PATH = '/api/v1/payments'

export const PAYMENTS_PAGE_SIZE = 10

/** Read at call time, not at module load, so tests can flip the flag. */
const isMockPaymentsApi = () => process.env.NEXT_PUBLIC_PAYMENTS_API_MOCK === 'true'

const getBasePath = () => (isMockPaymentsApi() ? MOCK_PAYMENTS_PATH : REAL_PAYMENTS_PATH)

/** Empty base url keeps mock calls on the current origin; real ones fall back to the API base. */
const getRequestInit = () => (isMockPaymentsApi() ? { baseUrl: '' } : undefined)

export type GetPaymentsParams = {
  page?: number
  pageSize?: number
}

export const getPayments = async ({
  page = 1,
  pageSize = PAYMENTS_PAGE_SIZE,
}: GetPaymentsParams = {}): Promise<PaymentsPage> => {
  const searchParams = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })

  const response = await api.get(`${getBasePath()}?${searchParams.toString()}`, getRequestInit())

  return response.json()
}
