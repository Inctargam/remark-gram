import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, screen, userEvent, waitFor } from 'storybook/test'

import { AutoRenewalCheckbox } from './AutoRenewalCheckbox'

type CapturedRequest = {
  method: string
  url: string
  body: unknown
}

const capturedRequests: CapturedRequest[] = []

/**
 * Storybook does not run Next.js route handlers, so the subscriptions mock endpoint is
 * stubbed here. Requests are recorded to assert what the checkbox actually sends.
 */
const stubSubscriptionsFetch = (status = 200) => {
  const originalFetch = globalThis.fetch

  capturedRequests.length = 0

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString()
    const body = typeof init?.body === 'string' ? JSON.parse(init.body) : null

    capturedRequests.push({ method: init?.method ?? 'GET', url, body })

    return Response.json(
      { accountType: 'business', subscriptions: [], nextPaymentAt: null },
      { status }
    )
  }) as typeof globalThis.fetch

  return () => {
    globalThis.fetch = originalFetch
  }
}

const patchRequests = () => capturedRequests.filter(({ method }) => method === 'PATCH')

const meta = {
  title: 'features/CancelAutoRenewal/AutoRenewalCheckbox',
  component: AutoRenewalCheckbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    checked: true,
  },
  beforeEach: () => stubSubscriptionsFetch(),
} satisfies Meta<typeof AutoRenewalCheckbox>

export default meta

type Story = StoryObj<typeof meta>

/** UC-2: снятие галочки уходит на сервер как `autoRenewal: false`. */
export const TurnOff: Story = {
  play: async () => {
    await userEvent.click(screen.getByRole('checkbox', { name: 'Auto-Renewal' }))

    await waitFor(() => expect(patchRequests()).toHaveLength(1))
    await expect(patchRequests()[0].url).toContain('/subscriptions/auto-renewal')
    await expect(patchRequests()[0].body).toEqual({ autoRenewal: false })
  },
}

/** Выключенное автопродление можно включить обратно. */
export const TurnOn: Story = {
  args: {
    checked: false,
  },
  play: async () => {
    await userEvent.click(screen.getByRole('checkbox', { name: 'Auto-Renewal' }))

    await waitFor(() => expect(patchRequests()).toHaveLength(1))
    await expect(patchRequests()[0].body).toEqual({ autoRenewal: true })
  },
}

/** Отказ сервера: состояние откатывается, под чекбоксом появляется сообщение. */
export const RequestFailed: Story = {
  beforeEach: () => stubSubscriptionsFetch(500),
  play: async () => {
    await userEvent.click(screen.getByRole('checkbox', { name: 'Auto-Renewal' }))

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Failed to change auto-renewal. Please try again.'
      )
    )
  },
}
