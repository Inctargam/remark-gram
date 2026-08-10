import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { PaymentsPage } from '../model/types'
import { getPayments } from './paymentsApi'

const paymentsPage: PaymentsPage = {
  items: [
    {
      id: 'payment-1',
      dateOfPayment: '2026-08-10T12:00:00.000Z',
      endDateOfSubscription: '2026-08-11T12:00:00.000Z',
      priceCents: 1000,
      subscriptionType: 'day',
      paymentType: 'stripe',
    },
  ],
  page: 1,
  pageSize: 10,
  totalCount: 1,
  totalPages: 1,
}

const fetchMock = vi.fn()

/** Last URL the api module asked `fetch` for. */
const getRequestedUrl = () => String(fetchMock.mock.calls[0]?.[0])

const respondWith = (body: unknown, status = 200) => {
  fetchMock.mockImplementation(
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      })
  )
}

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_PAYMENTS_API_MOCK', 'true')
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  fetchMock.mockReset()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('getPayments', () => {
  it('asks for the first page with the default page size', async () => {
    respondWith(paymentsPage)

    await expect(getPayments()).resolves.toEqual(paymentsPage)
    expect(getRequestedUrl()).toContain('/api/mock/payments?page=1&pageSize=10')
  })

  it('passes the requested page and page size', async () => {
    respondWith(paymentsPage)

    await getPayments({ page: 3, pageSize: 5 })

    expect(getRequestedUrl()).toContain('page=3&pageSize=5')
  })

  it('targets the real backend path when the mock flag is off', async () => {
    vi.stubEnv('NEXT_PUBLIC_PAYMENTS_API_MOCK', 'false')
    respondWith(paymentsPage)

    await getPayments()

    expect(getRequestedUrl()).toContain('/api/v1/payments?')
  })
})
