import { beforeEach, describe, expect, it } from 'vitest'

import type { PaymentsPage } from '@/entities/payment'
import { resetSubscriptionsMockStore } from '@/shared/api/mock/subscriptionsStore'

import { getPaymentsHandler } from './paymentsHandler'

const MOCK_API_ORIGIN = 'https://dev.remark-gram.com:3000/api/mock/payments'

const getPage = (query = '') => getPaymentsHandler(new Request(`${MOCK_API_ORIGIN}?${query}`))

beforeEach(() => {
  resetSubscriptionsMockStore()
})

describe('getPaymentsHandler', () => {
  it('falls back to the first page and the default page size', async () => {
    const response = await getPage()
    const page: PaymentsPage = await response.json()

    expect(response.status).toBe(200)
    expect(page.page).toBe(1)
    expect(page.pageSize).toBe(10)
    expect(page.items).toHaveLength(10)
  })

  it('honours page and pageSize', async () => {
    const response = await getPage('page=2&pageSize=5')
    const page: PaymentsPage = await response.json()

    expect(page.items).toHaveLength(5)
    expect(page.totalPages).toBe(3)
  })

  it('rejects a non-positive page', async () => {
    expect((await getPage('page=0')).status).toBe(400)
    expect((await getPage('page=first')).status).toBe(400)
  })

  it('rejects a page size above the cap', async () => {
    expect((await getPage('pageSize=500')).status).toBe(400)
  })
})
